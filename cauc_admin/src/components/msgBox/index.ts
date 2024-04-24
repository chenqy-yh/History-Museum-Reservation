import {
    createVNode,
    render,
} from 'vue'

import messageBox from '@/components/msgBox/customMessageBox.vue'
import { CustomData, CustomFunction, CustomStyle } from '@/typings/msgBox'

const MessageBox = (
    customStyle?: CustomStyle, customData?: CustomData, customFunction?: CustomFunction) => {
    const container = document.createElement('div')
    document.body.appendChild(container)

    const vnode = createVNode(
        messageBox, {
        ...customStyle,
        ...customData,
        onConfirm: () => {
            customFunction?.onConfirm?.()
            handleClose()
        },
        onCancel: () => {
            customFunction?.onCancel?.()
            handleClose()
        },
    },
    )
    render(vnode, container)

    // 关闭并删除确认框
    function handleClose() {
        render(null, container)
        document.body.removeChild(container)
    }
}

export default MessageBox