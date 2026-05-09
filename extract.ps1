[xml]$docx = Get-Content -Path "extracted_docx\word\document.xml" -Raw
$ns = new-object Xml.XmlNamespaceManager $docx.NameTable
$ns.AddNamespace("w", "http://schemas.openxmlformats.org/wordprocessingml/2006/main")
$paragraphs = $docx.SelectNodes("//w:p", $ns)
$lines = @()
foreach ($p in $paragraphs) {
    $texts = $p.SelectNodes(".//w:t", $ns)
    if ($texts) {
        $line = ($texts | ForEach-Object { $_.InnerText }) -join ""
        if ($line.Trim() -ne "") { $lines += $line }
    }
}
$lines | Out-File -FilePath "extracted_text.txt" -Encoding utf8
