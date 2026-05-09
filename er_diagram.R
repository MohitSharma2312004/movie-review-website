# ER Diagram for Movie Review System in R
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

# 2. Generate the Chen-style ER Diagram using Graphviz DOT syntax
er_plot <- grViz("
digraph ERD {
  graph [rankdir=TB, nodesep=0.7, ranksep=0.8, pad=0.5];
  node [fontname='Helvetica', fontsize=12];
  
  # --- Entities ---
  node [shape=box, style=filled, fillcolor='#e2e8f0', color='#334155', peripheries=1];
  Movie [label='Movie'];
  User [label='User'];
  Blog [label='Blog'];
  Admin [label='Admin'];
  
  # --- Weak Entities ---
  node [peripheries=2];
  Review [label='Review'];

  # --- Strong Relationships ---
  node [shape=diamond, style=filled, fillcolor='#cbd5e1', peripheries=1];
  Rates [label='Rates'];
  Authors [label='Authors'];
  Manages_Blog [label='Manages'];
  Manages_Review [label='Manages'];

  # --- Identifying Relationships ---
  node [peripheries=2];
  Writes [label='Writes'];
  Belongs_To [label='Belongs_To'];

  # --- Regular Attributes ---
  node [shape=ellipse, style=filled, fillcolor='#f8fafc', peripheries=1];
  M_id [label=<<U>Movie_ID</U>>];
  M_title [label='Title'];
  U_id [label=<<U>User_ID</U>>];
  U_name [label='Username'];
  R_id [label=<<U>Review_ID</U>>];
  R_rating [label='Rating'];
  B_id [label=<<U>Blog_ID</U>>];
  B_title [label='Title'];
  A_id [label=<<U>Admin_ID</U>>];

  # --- Multivalued Attributes ---
  node [peripheries=2];
  U_email [label='Email'];

  # --- Derived Attributes ---
  node [peripheries=1, style='filled,dashed'];
  U_age [label='Age'];

  # --- Edges (Connections) ---
  edge [dir=none, color='#475569', penwidth=1.5, fontname='Helvetica', fontsize=10];
  
  # Entity to Attributes
  Movie -> M_id;
  Movie -> M_title;

  User -> U_id;
  User -> U_name;
  User -> U_email;   # Multivalued attached to User
  User -> U_age;     # Derived attached to User

  Review -> R_id;
  Review -> R_rating;

  Blog -> B_id;
  Blog -> B_title;

  Admin -> A_id;

  # Entity to Relationship to Entity
  User -> Rates [label='M'];
  Rates -> Movie [label='N'];

  User -> Writes [label='1'];
  Writes -> Review [label='N'];

  Review -> Belongs_To [label='N'];
  Belongs_To -> Movie [label='1'];

  User -> Authors [label='1'];
  Authors -> Blog [label='N'];

  Admin -> Manages_Blog [label='1'];
  Manages_Blog -> Blog [label='N'];

  Admin -> Manages_Review [label='1'];
  Manages_Review -> Review [label='N'];

  # Styling for the chart
  labelloc='t';
  label='Chen-Style ER Diagram: Movie Review System';
  fontsize=16;
  fontweight='bold';
}
")

# 3. Save as SVG and generate download link
svg_code <- export_svg(er_plot)
writeLines(svg_code, "chen_er_diagram.svg")

cat("ER Diagram successfully generated and saved as 'chen_er_diagram.svg'\n")

# Generate HTML download link (using data URI to avoid external dependencies)
encoded_svg <- URLencode(svg_code, reserved = TRUE)
html_link <- paste0(
  '<a href="data:image/svg+xml;utf8,', encoded_svg, 
  '" download="chen_er_diagram.svg" style="display:inline-block; padding:10px 20px; background-color:#0284c7; color:white; text-decoration:none; border-radius:5px; font-family:sans-serif;">',
  'Download ER Diagram (SVG)</a><br/>'
)

# Render link in Colab
if (requireNamespace("IRdisplay", quietly = TRUE)) {
  IRdisplay::display_html(html_link)
  # Also display the plot inline
  er_plot
} else {
  # Standard R environment
  print(er_plot)
}
