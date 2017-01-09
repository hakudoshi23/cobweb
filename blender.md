# Blender Features

+ GUI
	+ Window System
		+ Split panes to add
		+ Merge panes to remove
		+ Presets of pane configurations
		+ Everything has a keyboard shortcut
		+ Pane Types
			+ User Preferences Window
			+ Console Window (Input & Output)
			+ Info Window (main menu)
				+ Load files from disk
				+ Save files in custom format
				+ Export files (3ds, obj, x3d, etc.)
				+ Save screenshot
				+ About Us
			+ Outline Window (scene nodes)
				+ Show tree structure
				+ Expand & collapse childrens
				+ Toggle visibility, selection & rendering
			+ UV / Image editor
				+ View mode
				+ Edit mode
					+ Brush settings
						+ Radius
						+ Intensity
			+ Properties Window (selected object)
				+ Object modifiers
					+ Mirror
						+ Select axis to apply (1 or more)
					+ Subsurf
						+ Mean crease (resist smoothing, stay sharp)
						+ Increase / decrease level
			+ 3D Window (render)
				+ Preset views (X, Y, Z)
				+ Add background images
				+ Background images for predefined views (sketch)
				+ Scale & reposition background images
				+ Moving controls
					+ Regular smooth movement
					+ With precision (smaller scale)
					+ Aligned to an axis
					+ By fixed amount (10 by 10)
					+ Type numbers
				+ Interaction Modes
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
						+ Add & remove face (selected vertices)
					+ Sculpting Mode
						+ Brush settings
							+ Radius
							+ Strength
							+ Add or substract
						+ Multiple brushes
							+ Sculp Draw
							+ Smooth
							+ Clay Strips
							+ Snake Hook
							+ Thumb
							+ Crease
							+ Flatten
							+ Grab
						+ Symetry along an axis (not modifier)
						+ Dyntopo (increase triangle count with each stroke)
							+ Detail size (triangles to be added)
							+ Detail relative to scale
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
