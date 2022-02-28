// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.

import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld('electronAPI', {
	handleBackground: (callback:any) => {
		return ipcRenderer.on('update-background', callback)
	},
	// updateSpriteX: (callback: any) => ipcRenderer.on('update-sprite-x', callback),
	// writeLEDStatus: (value: 1|0) => {
	// 	ipcRenderer.invoke('write:LEDStatus', value)
	// },
})