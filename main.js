!function(window, document, $) {
	function init() {
		function zhToEn(zh, callback) {
			var url = 'http://fanyi.baidu.com/transapi?from=zh&to=en'
			url = encodeURIComponent(url);
			console.log(url)
			$.ajax({
				url: 'http://localhost:8900?url=' + url + '&zh_cn=' + zh,
				success: function(res) {
					callback && callback(res)
				}
			})
		}
		function domToTree(dom) {
			function getVal(dom) {
				var childNodes = dom.childNodes;
				var len = childNodes.length;
				if (len) {
					for (var i = 0; i < len; i++) {
						var child = childNodes[i];
						switch (child.nodeType) {
							case 3:
								nodeToThree(child);
								break;
							case 1:
								filterNode(child) && getVal(child);
								break;
						}
					}
				}
			}
			getVal(dom);
		}
		function filterNode(node) {
			var filter = [
				'script',
				'pre',
				'img'
			]
			for (var i = filter.length - 1; i >= 0; i--) {
				var text = filter[i];
				var uperText = text.toUpperCase();
				if (node.localName === text || node.nodeName === uperText) return false;
			}
			return true;
		}
		function nodeToThree(dom) {
			dom.nodeValue.trim() && intoHtml(dom);
		}
		function intoHtml(dom) {
			var text = dom.nodeValue.trim();
			if (!text) return;
			var encode = encodeURIComponent(dom.nodeValue);
			var encodeText = encodeURIComponent(text);
			function fn(res) {
				console.log(res)
				var encodeRes = encodeURIComponent(res.data[0].dst);
				var innerText = encode.replace(encodeText, encodeRes);
				dom.nodeValue = decodeURIComponent(innerText);
			}
			zhToEn(text, fn);
		}
		domToTree($('body')[0])
	}
	init()
}(window, document, $)