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
				+ Object modifiers
					+ Mirror
					+ Subsurf
			+ Console Window (Input & Output)
			+ 3D Window (render)
				+ Preset views (X, Y, Z)
				+ Background images for predefined views (sketch)
				+ Add background images
				+ Scale & reposition background images
				+ Interaction Modes
					+ Moving controls
						+ Regular smooth movement
						+ With precission (smaller scale)
						+ Aligned to an axis
						+ By fixed amount (10 by 10)
						+ Type numbers
					+ Object Mode (Object as a whole)
						+ Duplicate (Control + C & Control + V)
						+ Move, Rotate & Scale selection
					+ Edit mode (Vertices, Edges & Faces)
						+ Limit selection (Vertices | Edges | Faces)
						+ Select only visible elements (not hidden)
						+ Select loops (Vertices | Faces)
						+ Select by mouse area (rectangle)
						+ Add & remove selected items /w Control
						+ Move, Rotate & Scale selection
						+ Add loop cut (subdivide)
						+ Edge slide (move group by its edges)
						+ Duplicate selection
						+ Extrude selection
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
