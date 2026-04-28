# Script pour corriger tous les numeros de page du sommaire
$file = "RAPPORT_STAGE_2026_v1.html"
$content = Get-Content $file -Raw

# Liste des corrections (OLD -> NEW)
$corrections = @{
    '<span class="toc-page">11</span></div>    <div class="toc-line"><span class="toc-num">1.2</span><span>Localisation' = '<span class="toc-page">8</span></div>    <div class="toc-line"><span class="toc-num">1.2</span><span>Localisation'
    '<span class="toc-page">12</span></div>    <div class="toc-line"><span class="toc-num">1.3</span><span>Moyens Humains</span>' = '<span class="toc-page">9</span></div>    <div class="toc-line"><span class="toc-num">1.3</span><span>Moyens Humains</span>'
    '<span class="toc-page">15</span></div>    <div class="toc-line"><span class="toc-num">1.5</span><span>Pr' = '<span class="toc-page">12</span></div>    <div class="toc-line"><span class="toc-num">1.5</span><span>Pr'
    '<span class="toc-page">16</span></div>        <!-- CHAPITRE II' = '<span class="toc-page">13</span></div>        <!-- CHAPITRE II'
    '<span class="toc-num">2.5</span><span>Analyse de l' = '<span class="toc-num">2.5</span><span>Analyse de l'
    '<span class="toc-page">27</span></div>    <div class="toc-line"><span class="toc-num">3.6</span><span>Mod' = '<span class="toc-page">24</span></div>    <div class="toc-line"><span class="toc-num">3.6</span><span>Mod'
    '<span class="toc-page">28</span></div>    <div class="toc-line"><span class="toc-num">3.7</span><span>Conception de l' = '<span class="toc-page">25</span></div>    <div class="toc-line"><span class="toc-num">3.7</span><span>Conception de l'
    '<span class="toc-page">32</span></div>    <div class="toc-line"><span class="toc-num">3.11</span><span>Diagramme de S' = '<span class="toc-page">29</span></div>    <div class="toc-line"><span class="toc-num">3.11</span><span>Diagramme de S'
    '<span class="toc-page">33</span></div>    <div class="toc-line"><span class="toc-num">3.12</span><span>Planification Agile' = '<span class="toc-page">30</span></div>    <div class="toc-line"><span class="toc-num">3.12</span><span>Planification Agile'
    '<span class="toc-page">34</span></div>        <!-- CHAPITRE IV' = '<span class="toc-page">31</span></div>        <!-- CHAPITRE IV'
    '<span class="toc-page">46</span></div>        <!-- CHAPITRE V' = '<span class="toc-page">43</span></div>        <!-- CHAPITRE V'
    '<span class="toc-page">59</span></div>        <!-- CHAPITRE VI' = '<span class="toc-page">56</span></div>        <!-- CHAPITRE VI'
}

foreach ($old in $corrections.Keys) {
    $new = $corrections[$old]
    $content = $content -replace [regex]::Escape($old), $new
}

$content | Set-Content $file
Write-Host "Sommaire corrige avec succes!"
