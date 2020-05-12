<script>
    export let value = 0;
</script>

<div class="switch">
    <div class="title">Colour by</div>
    <span on:click={() => value = 0}>Type (season)</span>
    <input bind:value type="range" min="0" max="1" step="1"/>
    <span on:click={() => value = 1}>Country</span>
</div>

<style>
    .title {
        margin-bottom: 5px;
    }
    input {
        -webkit-appearance: none;
        width: 26px;
        height: 12px;
        background: #2a2a2a;
        border: 2px solid #2a2a2a;
        border-radius: 7px;
        position: relative;
        top: 1px;
        margin: 0 4px;
    }
    input:focus {
        outline: none;
    }
    input::-webkit-slider-runnable-track {
        width: 100%;
        height: 8px;
        cursor: pointer;
        background: #2a2a2a;
        border-radius: 7px;
    }
    input:focus::-webkit-slider-runnable-track {
        background: #2a2a2a;
    }
    input::-webkit-slider-thumb {
        -webkit-appearance: none;
        height: 8px;
        width: 8px;
        border-radius: 50%;
        background: #fff;
        cursor: pointer;
        margin: 0;
    }
    input::-moz-range-track {
        width: 100%;
        height: 12px;
        cursor: pointer;
        background: #2a2a2a;
        border-radius: 4px;
        border-left: 1px solid #2a2a2a;
        border-right: 1px solid #2a2a2a;
    }
    input::-moz-range-thumb {
        height: 8px;
        width: 8px;
        border-radius: 50%;
        background: #fff;
        cursor: pointer;
    }
    input::-ms-track {
        width: 100%;
        height: 12px;
        cursor: pointer;
        background: transparent;
        color: transparent;
        border-color: transparent;
    }
    input::-ms-thumb {
        height: 8px;
        width: 8px;
        border-radius: 50%;
        background: #fff;
        cursor: pointer;
    }
    input::-ms-fill-lower {
        background: #2a2a2a;
    }
    input:focus::-ms-fill-lower {
        background: #2a2a2a;
    }
    input::-ms-fill-upper {
        background: #2a2a2a;
    }
    input:focus::-ms-fill-upper {
        background: #2a2a2a;
    }
    span {
        cursor: pointer;
        font-size: 14px;
        font-weight: 500;
    }
    span:hover,
    span:focus {
        text-decoration: underline;
    }
</style>
