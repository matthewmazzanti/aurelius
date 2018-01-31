document.addEventListener('DOMContentLoaded', function() {
    function syntaxHighlight() {
        if (hljs !== undefined) {
            var codeBlocks = document.querySelectorAll('pre code');
            for (var i = 0; i < codeBlocks.length; i++) {
                var codeBlock = codeBlocks[i];
                hljs.highlightBlock(codeBlock);

                // Since the github css doesn't play nice with highlight.js, we
                // need to set the background of all `pre` elements to be the
                // color of the inner `code` block.
                codeBlock.parentNode.style.background = (
                    getComputedStyle(codeBlock)
                        .getPropertyValue('background'));
            }
        }
    }

    function renderMath() {
      inline = document.getElementByClassName("math math-inline");
      for(let node of inline) {
        render(node.innerText, node);
      }
    }


    syntaxHighlight();
    renderMath();
    var previewWindow = document.getElementById('markdown-preview');
    var webSocketUrl = ('ws://localhost:' +
                        previewWindow.getAttribute('data-websocket-port'));

    var socket = new ReconnectingWebSocket(webSocketUrl);
    socket.maxReconnectInterval = 5000;

    socket.onmessage = function(event) {
        document.getElementById('markdown-preview').innerHTML = event.data;
        syntaxHighlight();
        renderMath();
    }

    socket.onclose = function(event) {
        // Close the browser window.
        window.open('', '_self', '');
        window.close();
    }
});
