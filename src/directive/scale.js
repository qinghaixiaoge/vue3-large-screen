import debounce from "@/utils/debounce";
export default{
    mounted (el,binding) {
        const {width,height} = binding.value
        function autoResize() {
            const scalex = window.innerWidth / width;
            const scaleY = window.innerHeight / height;
            const scale = Math.min(scalex, scaleY)
            const left = (window.innerWidth - width * scale) / 2
            const top = (window.innerHeight - height * scale) / 2
            el.style.transformOrigin = "left top";
            el.style.transform = `translate(${left}px,${top}px) scale(${scale}) `
        }
        autoResize()
        el.autoResize = debounce(autoResize,200)
        window.addEventListener("resize",el.autoResize)
    }
    ,
    unmounted (el) {
        window.removeEventListener("resize",el.autoResize)
    }
}