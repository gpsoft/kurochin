function run() {
	var theSystem;	// the ParticleSystem

	const drawCanvas = (ctx2d)=>{
		ctx2d.fillStyle = 'white';
		ctx2d.fillRect(0, 0, ctx2d.canvas.width, ctx2d.canvas.height)
	};
	const drawEdge = (ctx2d, edge, fromPt, toPt)=>{
		ctx2d.strokeStyle = 'rgba(0,0,0, .333)';
		ctx2d.lineWidth = 1;
		ctx2d.beginPath();
		ctx2d.moveTo(fromPt.x, fromPt.y);
		ctx2d.lineTo(toPt.x, toPt.y);
		ctx2d.stroke();
	};
	const drawNode = (ctx2d, node, pt)=>{
		let w = 10
		ctx2d.fillStyle = 'rgba(0,0,0, 1)';
		ctx2d.fillRect(pt.x-w/2, pt.y-w/2, w,w);
	};

	const startDragging = ($canvas, node)=>{
		node.fixed = true;
		$canvas.bind('mousemove.dragging', (ev)=>{
			node.p = theSystem.fromScreen(toScreenPt($canvas, ev));
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

		return {
			init: (system)=>{
				system.screenSize(canvas.width, canvas.height)
				system.screenPadding(100)

				$canvas.bind('mousedown', (ev)=>{
					let {node, distance} = theSystem.nearest(toScreenPt($canvas, ev));
					if ( node == null ) return false;

					startDragging($canvas, node);
					return false
				});
			},
			redraw: ()=>{
				drawCanvas(ctx2d);
				theSystem.eachEdge((edge, fromPt, toPt)=>{
					drawEdge(ctx2d, edge, fromPt, toPt);
				});
				theSystem.eachNode((node, pt)=>{
					drawNode(ctx2d, node, pt);
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
		sys.addNode('z');
		sys.addEdge('a','b');
		sys.addEdge('c','b');
		return sys;
	};

	theSystem = createSystem($('#app'));
}
