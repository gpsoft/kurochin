function run() {
	var app;

	const drawCanvas = (ctx2d)=>{
		ctx2d.fillStyle = 'white';
		ctx2d.fillRect(0, 0, ctx2d.canvas.width, ctx2d.canvas.height)
	};
	const drawEdge = (ctx2d, fromPt, toPt, edge)=>{
		ctx2d.strokeStyle = 'rgba(0,0,0, .333)';
		ctx2d.lineWidth = 1;
		ctx2d.beginPath();
		ctx2d.moveTo(fromPt.x, fromPt.y);
		ctx2d.lineTo(toPt.x, toPt.y);
		ctx2d.stroke();
	};
	const drawNode = (ctx2d, pt, node)=>{
		// let w = 10
		// ctx2d.fillStyle = 'rgba(0,0,0, 1)';
		// ctx2d.fillRect(pt.x-w/2, pt.y-w/2, w,w);

		// drawRect(ctx2d, pt, 'Yes', 60);
		drawOval(ctx2d, pt, 'Yes', 60, 0.7);
	};
	const drawRect = (ctx2d, pt, caption, minW)=>{
		let [w, h] = textSize(ctx2d, caption);
		let pad = 10;
		w = Math.max(w + pad, minW);
		h = h + pad;

		ctx2d.fillStyle = 'rgba(0, 0, 0, 1)';
		app.gfx.rect(pt.x-w/2, pt.y-h/2, w, h,
			4/*radius*/,
			{fill: ctx2d.fillStyle}
		);
		if ( !caption ) return;

		drawText(ctx2d, pt, caption);
	};
	const drawOval = (ctx2d, pt, caption, minW, ratio)=>{
		let [w, h] = textSize(ctx2d, caption);
		let pad = 10;
		w = Math.max(w + pad, minW);
		h = w * ratio;

		ctx2d.fillStyle = 'rgba(0, 0, 0, 1)';
		app.gfx.oval(pt.x-w/2, pt.y-h/2, w, h,
			{fill: ctx2d.fillStyle}
		);
		if ( !caption ) return;

		drawText(ctx2d, pt, caption);
	};
	const textSize = (ctx2d, caption)=>{
		if ( !caption ) return [0, 0];
		let tm = ctx2d.measureText(caption);
		return [tm.width,
			tm.actualBoundingBoxAscent+tm.actualBoundingBoxDescent];
	};
	const drawText = (ctx2d, pt, caption)=>{
		ctx2d.textAlign = 'center';
		ctx2d.fillStyle = 'white';
		ctx2d.fillText(caption, pt.x, pt.y);
	};

	const startDragging = ($canvas, node)=>{
		node.fixed = true;
		$canvas.bind('mousemove.dragging', (ev)=>{
			node.p = app.sys.fromScreen(toScreenPt($canvas, ev));
			return false;
		});
		$(window).bind('mouseup.dragging', (ev)=>{
			node.fixed = false;
			node.tempMass = 1000;
			$canvas.unbind('mousemove.dragging');
			$(window).unbind('mouseup.dragging');
			return false
		});
	};

	const toScreenPt = ($canvas, ev)=>{
		let off = $canvas.offset();
		return arbor.Point(
			ev.pageX - off.left,
			ev.pageY - off.top
		);
	};

	const makeRenderer = ($canvas)=>{
		let canvas = $canvas[0];
		let ctx2d = canvas.getContext('2d');
		ctx2d.font = 'bold 1.2em monospace'
		ctx2d.textBaseline = 'middle'

		return {
			init: (system)=>{
				system.screenSize(canvas.width, canvas.height)
				system.screenPadding(100)

				$canvas.bind('mousedown', (ev)=>{
					let {node, distance} = app.sys.nearest(toScreenPt($canvas, ev));
					if ( node == null ) return false;

					startDragging($canvas, node);
					return false
				});
			},
			redraw: ()=>{
				drawCanvas(ctx2d);
				app.sys.eachEdge((edge, fromPt, toPt)=>{
					drawEdge(ctx2d, fromPt, toPt, edge);
				});
				app.sys.eachNode((node, pt)=>{
					drawNode(ctx2d, pt, node);
				});
			},
		};
	};
	const createSystem = ($canvas)=>{
		let sys = arbor.ParticleSystem(
			1000,	// repulsion
			60,		// stiffness
			0.5,	// friction
			true,	// gravity
			24		// fps
		);
		sys.renderer = makeRenderer($canvas);

		let gfx = arbor.Graphics($canvas[0]);

		sys.addNode('');
		sys.addEdge('a','b');
		sys.addEdge('c','b');

		return {sys: sys, gfx: gfx};
	};

	app = createSystem($('#app'));
}
