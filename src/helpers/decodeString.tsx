function decodeString(input:any):String {
    var textarea = document.createElement("textarea");
    textarea.innerHTML = input;
    return textarea.value;
}
export default decodeString;
