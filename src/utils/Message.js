import { styled } from "@styils/vue"
import { render } from "vue"

// https://juejin.cn/post/7251515125048213541
// https://blog.csdn.net/YYY__6/article/details/131674307
// 如果用createApp记得卸载app.unmount()应用实例
const confirmStyle = {
    DivMessageContainer: styled('div', {
        left: '0',
        top: '0',
        width: '100vw',
        height: '100vh',
        position: 'fixed',
        background: 'rgba(0,0,0,0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    }),
    DivBox: styled('div', {
        width: '200px',
        minHeight: '100px',
        padding: '15px',
        background: '#fff',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        borderRadius: '5px'
    }),
    P: styled('p', {
        display: '-webkit-box',
        WebkitBoxOrient: 'vertical',
        WebkitLineClamp: 2,
        overflow: 'hidden',
    }),
    DivBtn: styled('p', {
        display: 'flex',
        justifyContent: 'space-evenly'
    })
}

const colors = {
    'message-info': '#6b9eee',
    'message-success': '#7ebf50',
    'message-warn': '#dc6a12',
    'message-error': '#cc3600'
}

const successStyle = {
    Div: styled('div', ({
            position: 'absolute',
            left: '50%',
            top: '0',
            zIndex: 999,
            boxShadow: '-2px -2px 5px rgba(0, 0, 0, 0.5)',
            background: '#fff',
            borderRadius: '5px',
            padding: '10px 30px',
            color: colors['message-success'],
            lineHeight: '2',
            display: 'flex',
            alignItems: 'center',
            transition: '0.3s',
            transform: 'translate(-50%,-20px)',
            opacity: 0,
            whiteSpace: 'nowrap',
        })
    )
}

const errorStyle = {
    Div: styled('div', ({
            position: 'absolute',
            left: '50%',
            top: '0',
            zIndex: 999,
            boxShadow: '-2px -2px 5px rgba(0, 0, 0, 0.5)',
            background: '#fff',
            borderRadius: '5px',
            padding: '10px 30px',
            color: colors['message-error'],
            lineHeight: '2',
            display: 'flex',
            alignItems: 'center',
            transition: '0.3s',
            transform: 'translate(-50%,-20px)',
            opacity: 0,
            whiteSpace: 'nowrap',
        })
    )
}

const confirmMessage = (message, confirm, cancel) => {
    const div = document.createElement("div")
    document.body.appendChild(div)
    // jsx语法糖，等同于虚拟dom
    render(<confirmStyle.DivMessageContainer>
        <confirmStyle.DivBox>
            <confirmStyle.P>{message}</confirmStyle.P>
            <confirmStyle.DivBtn>
                <button onClick={() => {
                    confirm && confirm()
                    div.remove()
                }}>确定</button>
                <button onClick={() => {
                    cancel && cancel()
                    div.remove()
                }}>取消</button>
            </confirmStyle.DivBtn>
        </confirmStyle.DivBox>
    </confirmStyle.DivMessageContainer>, div)
}

const successMessage = (message, duration = 2000) => {
    const div = document.createElement("div")
    document.body.appendChild(div)
    render(
        <successStyle.Div>
            <i className={`iconfont icon-chenggong`} style={{ fontSize: '20px', marginRight: '7px' }} />
            <div>{message}</div>
        </successStyle.Div>, div)
    // 给successStyle.Div的包含块设置定位
    // 给successStyle.Div修改样式
    requestAnimationFrame(() => {
        div.firstChild.style.opacity = 1
        div.firstChild.style.transform = 'translate(-50%,50px)'
    })
    //等一段时间，消失
    setTimeout(() => {
        div.firstChild.style.opacity = 0
        div.firstChild.style.transform ='translate(-50%,-20px)'
        div.firstChild.addEventListener('transitionend', function () {
            div.remove()
        }, { once: true })
    }, duration)
}

const errorMessage = (message, duration = 2000) => {
    const div = document.createElement("div")
    document.body.appendChild(div)
    render(
        <errorStyle.Div>
            <i className={`iconfont icon-shibai`} style={{ fontSize: '20px', marginRight: '7px' }} />
            <div>{message}</div>
        </errorStyle.Div>, div)
    // 给successStyle.Div的包含块设置定位
    // 给successStyle.Div修改样式
    requestAnimationFrame(() => {
        div.firstChild.style.opacity = 1
        div.firstChild.style.transform = 'translate(-50%,50px)'
    })
    //等一段时间，消失
    setTimeout(() => {
        div.firstChild.style.opacity = 0
        div.firstChild.style.transform ='translate(-50%,-20px)'
        div.firstChild.addEventListener('transitionend', function () {
            div.remove()
        }, { once: true })
    }, duration)
}


// 命令式弹窗组件
export const Message = {
    confirm(message, confirm, cancel) {
        confirmMessage(message, confirm, cancel)
    },
    success(message, duration) {
        successMessage(message, duration)
    },
    error(message, duration) {
        errorMessage(message, duration)
    }
}