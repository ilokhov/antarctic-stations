<script>
    let open = true;
    const toggle = () => open = !open;
</script>

<div class="help">
    {#if open}
        <div class="text">
            <div class="close" on:click={toggle}>×</div>    
            Hover over a point to see more information about a station. Use buttons below or <b>Left</b> and <b>Right</b> keys to move around years. Click on year below to quickly select a specific year.
        </div>
    {:else}
        <div class="open" on:click={toggle}>?</div>
    {/if}
</div>

<style>
    .help {
        position: absolute;
        bottom: 20px;
        left: 20px;
        display: none;
    }
    @media (min-width: 600px) {
        .help {
            display: block;
        }
    }
    .text {
        background: #fff;
        padding: 12px 28px 12px 20px;
        width: 300px;
        line-height: 1.5;
    }
    .close {
        cursor: pointer;
        position: absolute;
        right: 10px;
        top: 10px;
        width: 14px;
        height: 14px;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 16px;
    }
    .close:hover {
        text-decoration: underline;
    }
    .open {
        background: #fff;
        cursor: pointer;
        width: 60px;
        height: 60px;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 24px;
    }
    .open:hover {
        text-decoration: underline;
    }
</style>
