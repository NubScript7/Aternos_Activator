const editorEl = document.querySelector("#user-script")
const clearCodeEl = document.querySelector("#clear-code")
const evalCodeEl = document.querySelector("#eval-code")
const outputLogsEl = document.querySelector("#output-logs")

clearCodeEl.addEventListener("click", () => {

    editorEl.value = ""

})

evalCodeEl.addEventListener("click", async () => {

    if (typeof editorEl.value == "string" && editorEl.value.length == 0) return

    const url = window.location.origin + "/aternos/evaluate"


    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            evalScript: editorEl.value
        })
    })

    if (!response.ok) {{
        alert(`Something went wrong! status: ${response.statusText} (${response.status})`)
    }}

    const json = await response.json()

    let output = ""
    console.log({json})

    if (json.error == null) {
        output = `[${getCurrentTime()}/INFO]: ${json.output}`
    } else {{
        const error = typeof json.error == "object" ? JSON.stringify(json.error, null, 2) : json.error
        output = `[${getCurrentTime()}/ERROR]: ${error}`
    }}

    outputLogsEl.value += "\n" + output

})

function getCurrentTime() {
    const now = new Date();
    const time = now.toLocaleTimeString('en-US', { 
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    })

    return time
}
