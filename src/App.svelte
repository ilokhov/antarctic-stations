<script>
    import { onMount } from 'svelte';

    import Help from './Help.svelte';
    import Switch from './Switch.svelte';
    import YearControls from './YearControls.svelte';

    import { select } from 'd3-selection';
    import { geoPath, geoOrthographic, geoGraticule } from 'd3-geo';
    import { color as parseColor } from 'd3-color';
    import * as topojson from 'topojson-client';
    import _uniq from 'lodash-es/uniq';
    import _range from 'lodash-es/range';

    import land from './geo/land.json';
    import ice from './geo/ice.json';
    import stations from './stations/stations.tsv';

    const otherColorHex = '#777';
    const colors = {
        season: {
            'Permanent': '#864bff',
            'Summer': '#17c37b'
        },
        country: {
            'United States': '#17c37b',
            'Russia / Soviet Union': '#c10e23',
            'United Kingdom': '#ffad1e',
            'Argentina': '#0033ff',
            'Other (incl. joint)': otherColorHex
        }
    };

    // move McMurdo station to end of list to display it in foreground
    stations.push(
        stations.splice(
            stations.findIndex(s => s.name === 'McMurdo'), 1
        )[0]
    );

    stations.forEach(s => {
        s.year_est = +s.year_est;
        s.year_closed = s.year_closed ? +s.year_closed : false;

        s.display_year_closed =
            s.display_year_closed ? +s.display_year_closed :
            s.display_year_est && !s.display_year_closed ? false :
            s.year_closed;

        s.display_year_est =
            s.display_year_est ? +s.display_year_est : s.year_est;
    });

    const autoTooltipStations = stations.filter(s => s.auto_tooltip);

    const estYears = _uniq(stations.map(s => s.year_est));
    const minYear = Math.min(...estYears);
    const maxYear = 2020;
    const years = _range(minYear, maxYear + 1);

    let year = maxYear;
    $: year = year > maxYear ? maxYear : year < minYear ? minYear : year;
    $: year && updateYear();
    $: year && hideTooltip();
    $: year && autoTooltip();

    let circles;
    let key;
    let tooltip;
    let tooltipContent;

    let switchValue = 0;
    let keyType;
    $: {
        keyType = switchValue === 0 ? 'season' : 'country';
        updateColors();
    }

    const landFeat = topojson.feature(land, land.objects.antarctica);
    const iceFeat = topojson.feature(ice, ice.objects.shelves);

    const mobileMaxWidth = 600;
    const winWidth = window.innerWidth;
    const winHeight = window.innerHeight;
    const isMobile = winWidth < mobileMaxWidth;
    const width = winWidth;
    const height = !isMobile ? Math.min(winHeight - 125, 825) : 400;
    const mapPaddingY = 40;

    function updateColors() {
        if (!circles || !key) return;

        key.html('');
        for (const item in colors[keyType]) {
            const color = colors[keyType][item];

            const fillColor = parseColor(color);
            fillColor.opacity = 0.7;

            key.append('div')
                .text(item)
                .append('span')
                .lower()
                .style('background', fillColor.formatRgb())
                .style('border-color', color);
        }

        const _type = keyType === 'season' ? 'type' : 'country';
        circles
            .attr('fill', d => {
                return colors[keyType][d[_type]] || otherColorHex;
            })
            .attr('stroke', d => {
                return colors[keyType][d[_type]] || otherColorHex;
            });
    }

    function updateYear() {
        if (!year || !circles) return;

        circles.classed('visible', d => {
            if (year >= d.year_est && (d.year_closed ? year <= d.year_closed : true)) {
                return true;
            } else {
                return false;
            }
        });
    }

    function init() {
        updateYear();
        updateColors();
    }

    function autoTooltip() {
        if (isMobile) return;

        const s = autoTooltipStations.find(s => s.year_est === year);
        if (!s) return;

        const circle = circles.filter(d => d.name === s.name).node();
        showTooltip(circle, s);
    }

    function showTooltip(circle, station) {
        if (!tooltip || !tooltipContent) return;

        select(circle).classed('tooltip-active', true);

        let content = `
        <div class='name'>${station.name}</div>
        <div>Country: <span class='highlight'>${station.country}</span></div>
        <div>Type: <span class='highlight'>${station.type}</span></div>
        <div>Location: <span class='highlight'>${station.location}</span></div>
        <div>Established: <span class='highlight'>${station.display_year_est}</span></div>
        `;
        if (station.notes) content += `<div class='notes'>${station.notes}</div>`;
        tooltipContent.html(content);
        const tooltipHeight = tooltip.node().getBoundingClientRect().height;

        const cx = parseInt(circle.getAttribute('cx'), 10);
        const cy = parseInt(circle.getAttribute('cy'), 10);

        const isBelowCirlce = cy < 140;

        // width of tooltip: 280
        // left offset to be in the middle of circle: 280 / 2 = 140
        tooltip.style('left', `${cx - 140}px`);

        if (isBelowCirlce) {
            tooltip.classed('below-circle', true);
            // account for map padding, add a bit to move the tooltip down
            tooltip.style('top', `${cy + mapPaddingY + 12}px`);
        }
        else {
            tooltip.classed('below-circle', false);
            // account for tooltip height (when filled with content)
            // and map padding, subtract a bit to move the tooltip up
            tooltip.style('top', `${cy - tooltipHeight + mapPaddingY - 12}px`);
        }

        tooltip.style('visibility', 'visible');
    }

    function hideTooltip() {
        if (!tooltip) return;

        select('.tooltip-active').classed('tooltip-active', false);
        tooltip.style('visibility', 'hidden');
    }

    function hideTooltipDesktop() {
        if (isMobile) return;
        hideTooltip();
    }

    onMount(() => {
        const map = select('#map');
        const svgContainer = select('.svg-container');

        const svg = svgContainer
            .append('svg')
            .lower()
            .attr('width', width)
            .attr('height', height);

        const projection = geoOrthographic().rotate([0, 90]);
        const path = geoPath(projection);
        projection.fitSize([width, height - mapPaddingY * 2], landFeat);

        const mapG = svg.append('g').style('transform', `translateY(${mapPaddingY}px)`);

        mapG.append('g')
            .selectAll('path')
            .data(landFeat.features)
            .enter()
            .append('path')
            .classed('land', true)
            .attr('d', path);

        mapG.append('g')
            .selectAll('path')
            .data(iceFeat.features)
            .enter()
            .append('path')
            .classed('ice', true)
            .attr('d', path);

        const graticuleInner = geoGraticule();
        graticuleInner.step([30, 10]).extent([
            [-180, -90],
            [180, -60 + 1e-6]
        ]);

        const graticuleOuter = geoGraticule();
        graticuleOuter.step([30, 90]).extent([
            [-180, -60],
            [180, 90]
        ]);

        mapG.append('path')
            .datum(graticuleInner)
            .classed('graticule', true)
            .attr('d', path);

        mapG.append('path')
            .datum(graticuleOuter)
            .classed('graticule outer', true)
            .attr('d', path);

        circles = mapG
            .selectAll('circle')
            .data(stations)
            .enter()
            .append('circle')
            .attr('cx', d => projection([d.lon, d.lat])[0])
            .attr('cy', d => projection([d.lon, d.lat])[1])
            .attr('r', '5px');

        circles.on('mouseover', function(d) {
            showTooltip(this, d);
        })
        .on('mouseleave', function(d) {
            hideTooltip();
        });

        key = select('#key');
        tooltip = select('#tooltip');
        tooltipContent = select('#tooltip-content');

        init();
    });
</script>

<div id="map" on:click="{hideTooltipDesktop}">
    <div class="svg-container"></div>
    <div id="tooltip">
        <div class="tooltip-close" on:click={hideTooltip}>×</div>
        <div id="tooltip-content"></div>
        <i></i>
    </div>
    <div class="info-container">
        <div id="key-container">
            <div id="key"></div>
            <Switch bind:value={switchValue} />
        </div>
        <Help />
    </div>
</div>
<div class="col">
    <YearControls bind:year {minYear} {maxYear} {years} />
</div>
