<script>
    import _throttle from 'lodash-es/throttle';

    export let year;
    export let minYear;
    export let maxYear;
    export let years;

    function handleKeydown(e) {
        if (e.code === 'ArrowLeft') year--;
        else if (e.code === 'ArrowRight') year++;
    }
</script>

<svelte:window on:keydown={_throttle(handleKeydown, 100)}/>

<div class="year-controls">
    <div class="button-wrap left">
        <button
            on:click="{() => year = minYear}"
            class="jump"
            class:disabled={year === minYear}>
            Jump to {minYear}
        </button>
        <button
            on:click={() => year--}
            class:disabled={year === minYear}
            class="prev">
            &#8592; Previous year
        </button>
    </div>
    <div class="year">
        {year ? year : ''}
        <select class="year-select" bind:value={year}>
            {#each years as _year}
                <option value={_year}>
                    {_year}
                </option>
            {/each}
        </select>
    </div>
    <div class="button-wrap">
        <button
            on:click={() => year++}
            class:disabled={year === maxYear}
            class="next">
            Next year &#8594;
        </button>
        <button
            on:click="{() => year = maxYear}"
            class="jump"
            class:disabled={year === maxYear}>
            Jump to {maxYear}
        </button>
    </div>
</div>

<style>
    .year-controls {
        display: flex;
        align-items: center;
        border-bottom: 1px solid #2a2a2a;
    }
    @media (min-width: 600px) {
        .year-controls {
            justify-content: center;
            border: 0;
        }
        .button-wrap {
            width: 320px;
        }
        .button-wrap.left {
            text-align: right;
        }
    }
    button {
        background: transparent;
        padding: 10px;
        -webkit-appearance: none;
        color: #222;
        font-size: 13px;
        font-weight: 500;
        border: 0;
        cursor: pointer;
        text-align: left;
    }
    @media (min-width: 600px) {
        button {
            font-size: 16px;
            border: 1px solid #2a2a2a;
        }
    }
    .jump {
        display: none;
    }
    @media (min-width: 600px) {
        .jump {
            display: inline-block;
        }
    }
    button:hover {
        text-decoration: underline;
    }
    button:focus {
        outline: 0;
    }
    @media (min-width: 600px) {
        button.prev {
            margin-left: 20px;
        }
        button.next {
            margin-right: 20px;
        }
    }
    button.disabled {
        cursor: default;
        color: #aaa;
        border-color: #aaa;
    }
    button.disabled:hover {
        text-decoration: none;
    }
    .year {
        position: relative;
        font-family: 'PT Mono', monospace;
        font-size: 20px;
        margin: 0 5px;
    }
    @media (min-width: 600px) {
        .year {
            font-size: 56px;
            margin: 0 30px;
        }
    }
    .year-select {
        opacity: 0;
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        -webkit-appearance: none;
    }
    .year-select:hover {
        cursor: pointer;
    }
</style>
