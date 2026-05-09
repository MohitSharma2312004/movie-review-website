# Use Case Diagram for Movie Review System in R
# Please run this code in Google Colab with R runtime

# 1. Check and install required packages
required_packages <- c("DiagrammeR", "DiagrammeRsvg", "xml2")
for (pkg in required_packages) {
  if (!requireNamespace(pkg, quietly = TRUE)) {
    install.packages(pkg)
  }
}

library(DiagrammeR)
library(DiagrammeRsvg)
library(xml2)

# 2. Generate the Use Case Diagram using Graphviz DOT syntax
use_case_plot <- grViz("
digraph UseCaseDiagram {
  graph [rankdir=LR, splines=line, nodesep=0.5, ranksep=1.2];
  node [fontname='Helvetica', fontsize=12];

  # Actors (Using simple nodes on the left and right)
  node [shape=plaintext, fontcolor='#1e293b', fontname='Helvetica-Bold'];
  User [label=<<table border='0' cellborder='0'><tr><td><font point-size='24'>👤</font></td></tr><tr><td>User</td></tr></table>>];
  Admin [label=<<table border='0' cellborder='0'><tr><td><font point-size='24'>🛠️</font></td></tr><tr><td>Admin</td></tr></table>>];
  OMDb [label=<<table border='0' cellborder='0'><tr><td><font point-size='24'>🌐</font></td></tr><tr><td>OMDb API</td></tr></table>>];

  # System Boundary
  subgraph cluster_System {
    label='MovieNova System Boundary';
    fontname='Helvetica-Bold';
    fontsize=14;
    style=rounded;
    color='#cbd5e1';
    bgcolor='#f8fafc';
    penwidth=2;

    # Use Cases (Ellipses)
    node [shape=ellipse, style=filled, fillcolor='#bae6fd', color='#0284c7', penwidth=1.5, fontname='Helvetica', width=2];
    
    UC_Search [label='Search Movies'];
    UC_View [label='View Movie Details'];
    UC_Review [label='Write Review'];
    UC_Rate [label='Rate Movie'];
    UC_Blog [label='Write/Read Blog'];
    
    node [fillcolor='#fef08a', color='#ca8a04'];
    UC_ManageRev [label='Moderation & Delete Reviews'];
    UC_ManageBlog [label='Moderation & Delete Blogs'];
    UC_Dashboard [label='View Admin Dashboard'];
  }

  # Aligning Actors (Optional for neatness)
  {rank=source; User;}
  {rank=sink; Admin; OMDb;}

  # Relationships (Associations)
  edge [color='#475569', penwidth=1.5, arrowsize=0.8];
  
  # User interactions
  User -> UC_Search;
  User -> UC_View;
  User -> UC_Review;
  User -> UC_Rate;
  User -> UC_Blog;

  # Include dependencies (<<include>>)
  edge [color='#64748b', style=dashed, penwidth=1, dir=forward];
  UC_Search -> OMDb [label='<<include>>', fontsize=10];
  UC_View -> OMDb [label='<<include>>', fontsize=10];
  
  # Admin interactions
  edge [color='#475569', style=solid, penwidth=1.5, dir=back];
  
  UC_ManageRev -> Admin;
  UC_ManageBlog -> Admin;
  UC_Dashboard -> Admin;

  # Styling for the chart
  labelloc='t';
  label='Use Case Diagram: Movie Review & Blogging System';
  fontsize=16;
  fontweight='bold';
}
")

# 3. Save as SVG and generate download link
svg_code <- export_svg(use_case_plot)
writeLines(svg_code, "use_case_diagram.svg")

cat("Use Case Diagram successfully generated and saved to Colab environment (use_case_diagram.svg)\n")

# Generate HTML download link (using data URI)
encoded_svg <- URLencode(svg_code, reserved = TRUE)
html_link <- paste0(
  '<a href="data:image/svg+xml;utf8,', encoded_svg, 
  '" download="use_case_diagram.svg" style="display:inline-block; padding:10px 20px; background-color:#0284c7; color:white; text-decoration:none; border-radius:5px; font-family:sans-serif;">',
  'Download Use Case Diagram (SVG)</a><br/><br/>'
)

# Render link in Colab
if (requireNamespace("IRdisplay", quietly = TRUE)) {
  IRdisplay::display_html(html_link)
  # Also display the plot inline
  print(use_case_plot)
} else {
  # Standard R environment fallback
  print(use_case_plot)
}
