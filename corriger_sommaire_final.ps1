# Correction complete et systematique de tous les numeros de page du sommaire
$file = "RAPPORT_STAGE_2026_v1.html"
$content = Get-Content $file -Raw

# Mapping exact : Position dans le fichier -> Numero correct
# Je vais utiliser des patterns uniques pour chaque ligne

$content = $content `
    -replace '(<span class="toc-num">2.1</span><span>Pr.*sentation du Projet</span><span class="toc-dots"></span><span class="toc-page">)17', '${1}14' `
    -replace '(<span class="toc-num">2.2</span><span>Stack Technologique.*Back-end</span><span class="toc-dots"></span><span class="toc-page">)18', '${1}15' `
    -replace '(<span class="toc-num">2.3</span><span>Stack Technologique.*Front-end</span><span class="toc-dots"></span><span class="toc-page">)19', '${1}16' `
    -replace '(<span class="toc-num">2.4</span><span>Stack Technologique.*DevOps &amp; Outils</span><span class="toc-dots"></span><span class="toc-page">)20', '${1}17' `
    -replace '(<span class="toc-num">2.5</span><span>Analyse de l.*Existant</span><span class="toc-dots"></span><span class="toc-page">)18', '${1}18' `
    -replace '(<span class="toc-num">3.1</span><span>.*tude des Besoins Fonctionnels</span><span class="toc-dots"></span><span class="toc-page">)22', '${1}19' `
    -replace '(<span class="toc-num">3.2</span><span>.*tude des Besoins Non Fonctionnels</span><span class="toc-dots"></span><span class="toc-page">)23', '${1}20' `
    -replace '(<span class="toc-num">3.3</span><span>Cahier des Charges</span><span class="toc-dots"></span><span class="toc-page">)21', '${1}21' `
    -replace '(<span class="toc-num">3.4</span><span>Conception de la Base de Donn.*s</span><span class="toc-dots"></span><span class="toc-page">)25', '${1}22' `
    -replace '(<span class="toc-num">3.4</span><span>Conception de la Base de Donn.*s \(suite\)</span><span class="toc-dots"></span><span class="toc-page">)26', '${1}23' `
    -replace '(<span class="toc-num">3.5</span><span>Mod.*le Conceptuel de Donn.*s \(MCD\)</span><span class="toc-dots"></span><span class="toc-page">)27', '${1}24' `
    -replace '(<span class="toc-num">3.6</span><span>Mod.*le Logique de Donn.*s \(MLD\)</span><span class="toc-dots"></span><span class="toc-page">)28', '${1}25' `
    -replace '(<span class="toc-num">3.7</span><span>Conception de l.*Application</span><span class="toc-dots"></span><span class="toc-page">)26', '${1}26' `
    -replace '(<span class="toc-num">3.8</span><span>Diagrammes des Cas d.*Utilisation</span><span class="toc-dots"></span><span class="toc-page">)27', '${1}27' `
    -replace '(<span class="toc-num">3.9</span><span>Diagramme de Classes</span><span class="toc-dots"></span><span class="toc-page">)28', '${1}28' `
    -replace '(<span class="toc-num">3.10</span><span>Diagramme de S.*quence.*R.*servation</span><span class="toc-dots"></span><span class="toc-page">)32', '${1}29' `
    -replace '(<span class="toc-num">3.11</span><span>Diagramme de S.*quence.*Paiement &amp; QR Code</span><span class="toc-dots"></span><span class="toc-page">)33', '${1}30' `
    -replace '(<span class="toc-num">3.12</span><span>Planification Agile.*Sprints &amp; Backlog</span><span class="toc-dots"></span><span class="toc-page">)34', '${1}31' `
    -replace '(<span class="toc-num">4.1</span><span>Tableau de Bord Administrateur.*Interface R.*elle</span><span class="toc-dots"></span><span class="toc-page">)35', '${1}32' `
    -replace '(<span class="toc-num">4.2</span><span>Capture.*QR Code de R.*servation</span><span class="toc-dots"></span><span class="toc-page">)36', '${1}33' `
    -replace '(<span class="toc-num">4.3</span><span>Capture.*Inscription &amp; Cr.*ation de Compte</span><span class="toc-dots"></span><span class="toc-page">)37', '${1}34' `
    -replace '(<span class="toc-num">4.4</span><span>Capture.*Page de Paiement Stripe</span><span class="toc-dots"></span><span class="toc-page">)38', '${1}35' `
    -replace '(<span class="toc-num">4.5</span><span>Capture.*Gestion des R.*servations \(Admin\)</span><span class="toc-dots"></span><span class="toc-page">)39', '${1}36' `
    -replace '(<span class="toc-num">4.6</span><span>Capture.*Tableau de Bord Analytics</span><span class="toc-dots"></span><span class="toc-page">)40', '${1}37' `
    -replace '(<span class="toc-num">4.7</span><span>Performance &amp; Optimisation</span><span class="toc-dots"></span><span class="toc-page">)38', '${1}38' `
    -replace '(<span class="toc-num">5.5</span><span>Architecture Frontend.*React 19</span><span class="toc-dots"></span><span class="toc-page">)46', '${1}43' `
    -replace '(<span class="toc-num">5.6</span><span>Migrations de la Base de Donn.*s</span><span class="toc-dots"></span><span class="toc-page">)47', '${1}44' `
    -replace '(<span class="toc-num">5.7</span><span>Tests &amp; M.*triques Qualit.*</span><span class="toc-dots"></span><span class="toc-page">)48', '${1}45' `
    -replace '(<span class="toc-num">5.8</span><span>Partie Codage de l.*Application</span><span class="toc-dots"></span><span class="toc-page">)46', '${1}46' `
    -replace '(<span class="toc-num">5.9</span><span>Notifications &amp; Temps R.*el</span><span class="toc-dots"></span><span class="toc-page">)50', '${1}47' `
    -replace '(<span class="toc-num">5.10</span><span>API REST.*Endpoints \(1/2\)</span><span class="toc-dots"></span><span class="toc-page">)51', '${1}48' `
    -replace '(<span class="toc-num">5.11</span><span>API REST.*Endpoints \(2/2\)</span><span class="toc-dots"></span><span class="toc-page">)52', '${1}49' `
    -replace '(<span class="toc-num">5.12</span><span>Tests Pest PHP.*Exemples &amp; R.*sultats</span><span class="toc-dots"></span><span class="toc-page">)53', '${1}50' `
    -replace '(<span class="toc-num">5.13</span><span>S.*curit.*OWASP Top 10</span><span class="toc-dots"></span><span class="toc-page">)54', '${1}51' `
    -replace '(<span class="toc-num">5.14</span><span>D.*ploiement.*Docker &amp; Docker Compose</span><span class="toc-dots"></span><span class="toc-page">)55', '${1}52' `
    -replace '(<span class="toc-num">5.15</span><span>Promotion du Projet</span><span class="toc-dots"></span><span class="toc-page">)53', '${1}53' `
    -replace '(<span class="toc-num">6.3</span><span>Perspectives &amp; .*volutions</span><span class="toc-dots"></span><span class="toc-page">)59', '${1}56' `
    -replace '(<span class="toc-num">6.4</span><span>Difficult.*s &amp; Solutions</span><span class="toc-dots"></span><span class="toc-page">)60', '${1}57'

$content | Set-Content $file
Write-Host "Sommaire corrige !" -ForegroundColor Green
