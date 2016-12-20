# Blender Features

+ GUI
	+ Window System
		+ Split panes to add
		+ Merge panes to remove
		+ Presets of pane configurations
		+ Everything has a keyboard shortcut
		+ Pane Types
			+ User Preferences Window
			+ Info Window (main menu)
				+ Load files from disk
				+ Save files in custom format
				+ Export files (3ds, obj, x3d, etc.)
				+ Save screenshot
				+ About Us
			+ Outline Window (scene nodes)
			+ Properties Window (selected object)
			+ Console Window (Input & Output)
			+ 3D Window (render)
				+ Interaction Modes
					+ Object Mode (Object as a whole)
						+ Move object
							+ Continuous (default)
							+ With precission (small scale)
							+ Aligned to an axis
							+ By fixed amount (10 by 10)
							+ Manually
						+ Rotate object
							+ Continuous (default)
							+ With precission (small scale)
							+ Aligned to an axis
							+ By fixed amount (10 by 10)
							+ Manually
						+ Scale object
							+ Continuous (default)
							+ With precission (small scale)
							+ Aligned to an axis
							+ By fixed amount (10 by 10)
							+ Manually
					+ Edit mode (Vertices, Edges & Faces)
						+ Limit selection (Vertices | Edges | Faces)
						+ Move, Rotate & Scale.
						+ [TODO]
					+ Sculpting Mode [TODO]
					+ Texture Paint Mode [TODO]
					+ Weight Paint Mode [TODO]
					+ Vertex Paint Mode [TODO]
                + Render Modes
                	+ Solid
                	+ Wireframe
                	+ Bouding Box
                	+ Texture
                	+ Material
                	+ Realistic
              	+ Layers System (Group objects by layer & toggle them)
+ Scene Tree Structure
	+ Parent & children navigation
    + Scene Properties
    + World Properties
    + Object Properties
	+ Different node types
		+ Camera Node
        	+ Camera Properties (proj / ortho)
		+ Lamp Node
			+ Lamp Properties (specular, diffuse, etc.)
			+ Point Type Properties
			+ Sun Type Properties
			+ Spot Type Properties
		+ Object Node
			+ Automatic Bounding Box (Octree?)
			+ Object Modifiers [TODO]
			+ Material [TODO]
