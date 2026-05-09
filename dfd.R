# DFD for Movie Review System in R (Levels 0, 1, and 2)
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

# ==========================================
# 2. LEVEL 0 (Context Diagram)
# ==========================================
dfd_level_0 <- grViz("
digraph Level0 {
  graph [rankdir=LR, nodesep=1.0, ranksep=1.2];
  node [fontname='Helvetica', fontsize=11];

  # External Entities
  node [shape=box, style=filled, fillcolor='#cbd5e1', color='#475569', width=1.5, height=0.6];
  User [label='User / Visitor'];
  Admin [label='Administrator'];
  OMDb [label='OMDb API'];

  # Main System Process
  node [shape=circle, style=filled, fillcolor='#bae6fd', color='#0284c7', fixedsize=true, width=1.8];
  System [label='0.0\\nMovie Review\\n& Blogging\\nSystem'];

  # Data Flows
  edge [fontname='Helvetica', fontsize=10, color='#475569', penwidth=1.5];
  User -> System [label='Search Queries, Reviews, Blogs'];
  System -> User [label='Movie Data, Reviews, Blogs'];
  
  System -> OMDb [label='API Requests'];
  OMDb -> System [label='Movie Data (JSON)'];

  Admin -> System [label='Management Actions'];
  System -> Admin [label='System Status & Reports'];

  labelloc='t';
  label='Level 0 DFD (Context Diagram): Movie Review System';
  fontsize=16;
  fontweight='bold';
}
")

# ==========================================
# 3. LEVEL 1 DFD
# ==========================================
dfd_level_1 <- grViz("
digraph Level1 {
  graph [rankdir=TB, nodesep=0.8, ranksep=1.0];
  node [fontname='Helvetica', fontsize=11];

  # External Entities
  node [shape=box, style=filled, fillcolor='#cbd5e1', color='#475569', width=1.5, height=0.6];
  User [label='User / Visitor'];
  Admin [label='Administrator'];
  OMDb [label='OMDb API'];

  # Processes
  node [shape=circle, style=filled, fillcolor='#bae6fd', color='#0284c7', fixedsize=true, width=1.5];
  P1 [label='1.0\\nSearch / View\\nMovies'];
  P2 [label='2.0\\nManage\\nReviews'];
  P3 [label='3.0\\nManage\\nBlogs'];
  P4 [label='4.0\\nAdmin\\nDashboard'];

  # Data Stores
  node [shape=cylinder, style=filled, fillcolor='#fef08a', color='#ca8a04', width=1.5, height=1];
  D1 [label='D1: Movies DB'];
  D2 [label='D2: Reviews DB'];
  D3 [label='D3: Blogs DB'];

  # Data Flows
  edge [fontname='Helvetica', fontsize=9, color='#475569', penwidth=1.5];

  User -> P1 [label='Search Query'];
  P1 -> OMDb [label='API Request'];
  OMDb -> P1 [label='Movie Data'];
  P1 -> User [label='Display Results'];
  P1 -> D1 [label='Cache Movie Info'];

  User -> P2 [label='Submit Review/Rating'];
  P2 -> D2 [label='Store Review'];
  D2 -> P2 [label='Fetch Reviews'];
  P2 -> User [label='Display Reviews'];

  User -> P3 [label='Write/Read Blog'];
  P3 -> D3 [label='Store Blog'];
  D3 -> P3 [label='Fetch Blogs'];
  P3 -> User [label='Display Blogs'];

  Admin -> P4 [label='Admin Actions'];
  P4 -> D2 [label='Delete/Moderate'];
  P4 -> D3 [label='Delete/Moderate'];
  D2 -> P4 [label='Review Stats'];
  D3 -> P4 [label='Blog Stats'];
  P4 -> Admin [label='Dashboard Views'];

  labelloc='t';
  label='Level 1 DFD: Movie Review System';
  fontsize=16;
  fontweight='bold';
}
")

# ==========================================
# 4. LEVEL 2 DFD (Decomposition of Process 2.0: Manage Reviews)
# ==========================================
dfd_level_2 <- grViz("
digraph Level2 {
  graph [rankdir=LR, nodesep=0.8, ranksep=1.0];
  node [fontname='Helvetica', fontsize=11];

  # External Entities
  node [shape=box, style=filled, fillcolor='#cbd5e1', color='#475569', width=1.5, height=0.6];
  User [label='User'];

  # Sub-Processes
  node [shape=circle, style=filled, fillcolor='#bae6fd', color='#0284c7', fixedsize=true, width=1.4];
  P2_1 [label='2.1\\nWrite\\nReview'];
  P2_2 [label='2.2\\nSubmit\\nRating'];
  P2_3 [label='2.3\\nFetch / Display\\nReviews'];
  P2_4 [label='2.4\\nUpdate Like/\\nDislike'];

  # Data Stores
  node [shape=cylinder, style=filled, fillcolor='#fef08a', color='#ca8a04', width=1.5, height=1];
  D2 [label='D2: Reviews DB'];

  # Data Flows
  edge [fontname='Helvetica', fontsize=9, color='#475569', penwidth=1.5];

  User -> P2_1 [label='Review Text'];
  User -> P2_2 [label='Star Rating (1-5)'];
  User -> P2_4 [label='Like/Dislike Action'];
  
  P2_1 -> D2 [label='Save Content & User'];
  P2_2 -> D2 [label='Save Rating DB'];
  P2_4 -> D2 [label='Update Counters'];
  
  User -> P2_3 [label='Request Movie Reviews'];
  D2 -> P2_3 [label='Reviews Data List'];
  P2_3 -> User [label='Rendered Reviews UI'];

  labelloc='t';
  label='Level 2 DFD (Process 2.0: Manage Reviews)';
  fontsize=16;
  fontweight='bold';
}
")

# ==========================================
# 5. Save and Generate Links
# ==========================================
generate_download <- function(plot_obj, filename, link_text) {
  svg_code <- export_svg(plot_obj)
  writeLines(svg_code, filename)
  
  encoded_svg <- URLencode(svg_code, reserved = TRUE)
  html_link <- paste0(
    '<a href="data:image/svg+xml;utf8,', encoded_svg, 
    '" download="', filename, '" style="display:inline-block; margin: 5px; padding:10px 20px; background-color:#0284c7; color:white; text-decoration:none; border-radius:5px; font-family:sans-serif;">',
    link_text, '</a>'
  )
  return(html_link)
}

# Generate Links
l0_link <- generate_download(dfd_level_0, "dfd_level_0.svg", "Download Level 0 DFD")
l1_link <- generate_download(dfd_level_1, "dfd_level_1.svg", "Download Level 1 DFD")
l2_link <- generate_download(dfd_level_2, "dfd_level_2.svg", "Download Level 2 DFD")

cat("DFDs successfully generated and saved to Colab environment (dfd_level_0.svg, dfd_level_1.svg, dfd_level_2.svg)\n")

# Display in Colab
if (requireNamespace("IRdisplay", quietly = TRUE)) {
  # Show Download Buttons
  IRdisplay::display_html(paste0("<div style='margin-bottom: 20px;'>", l0_link, l1_link, l2_link, "</div>"))
  
  # Print the plots so user can see them inline without having to download
  print(dfd_level_0)
  print(dfd_level_1)
  print(dfd_level_2)
} else {
  # Standard R environment fallback
  print(dfd_level_0)
  print(dfd_level_1)
  print(dfd_level_2)
}
