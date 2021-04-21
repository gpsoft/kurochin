function run() {
	let chin = createChin('#chin', {
		renderCanvas: (ctx2d)=>{
			chin.fillCanvas(ctx2d, '#fff');
		},
		renderEdge: (ctx2d, fromPt, toPt, edge)=>{
			chin.drawLine(ctx2d, fromPt, toPt, '#1f1f1f');
		},
		renderNode: (ctx2d, pt, node)=>{
			let [w, h] = chin.textSize(ctx2d, 'YES');
			w += 10;
			h += 10;
			chin.fillRect(ctx2d, pt, w, h, '#ff0000');
			// chin.fillRRect(ctx2d, pt, w, h, '#ff0000');
			// chin.fillOval(ctx2d, pt, w, h, '#ff0000');
			chin.drawText(ctx2d, pt, 'YES', '#fff');
		},
	});

	chin.sys.addNode('');
	chin.sys.addEdge('a','b');
	chin.sys.addEdge('c','b');
}
