# 觀棋心徑 — 一鍵 build .aab 腳本
# 因專案根目錄含中文「卜卦系統」,Gradle 在 Windows 下無法直接 build,
# 因此先把 android/ 鏡射到 C:\guanqi-build,再從那裡 build,完成後拷回 dist/。
#
# 用法:從 PowerShell 執行
#   .\tools\build_aab.ps1
#
# 前置:已跑過至少一次完整流程,android/ 與 keystore/ 都存在。
# 修改 site/ 的內容後,先跑 `npm run build:web && npx cap sync android`,
# 再跑這支腳本就會出新的 .aab。

$ErrorActionPreference = "Stop"

$ProjectRoot = "E:\卜卦系統"
$BuildRoot   = "C:\guanqi-build"
$NodeMirror  = "C:\node_modules\@capacitor\android"
$Aab         = "$BuildRoot\app\build\outputs\bundle\release\app-release.aab"
$DistDir     = "$ProjectRoot\dist"

$env:ANDROID_HOME      = "$env:LOCALAPPDATA\Android\Sdk"
$env:ANDROID_SDK_ROOT  = $env:ANDROID_HOME
$env:JAVA_HOME         = "C:\Program Files\Android\Android Studio\jbr"
$env:Path              = "$env:JAVA_HOME\bin;$env:Path"

Write-Host "[1/5] Mirror android/ → $BuildRoot"
if (Test-Path $BuildRoot) { cmd /c "rmdir /S /Q `"$BuildRoot`"" | Out-Null }
Copy-Item -Recurse -Force "$ProjectRoot\android" $BuildRoot

Write-Host "[2/5] Mirror @capacitor/android → $NodeMirror"
$NodeMirrorParent = Split-Path $NodeMirror -Parent
if (-not (Test-Path $NodeMirrorParent)) { New-Item -ItemType Directory -Path $NodeMirrorParent -Force | Out-Null }
if (Test-Path $NodeMirror) { Remove-Item -Recurse -Force $NodeMirror }
Copy-Item -Recurse -Force "$ProjectRoot\node_modules\@capacitor\android" $NodeMirror

Write-Host "[3/5] Fix local.properties (forward slashes for Java escapes)"
"sdk.dir=$($env:ANDROID_HOME -replace '\\','/')" | Set-Content -Path "$BuildRoot\local.properties" -Encoding ASCII

Write-Host "[4/5] gradlew bundleRelease"
Push-Location $BuildRoot
try {
    & .\gradlew.bat bundleRelease --no-daemon
    if ($LASTEXITCODE -ne 0) { throw "Gradle build failed (exit $LASTEXITCODE)" }
} finally {
    Pop-Location
}

Write-Host "[5/5] Copy .aab → $DistDir"
if (-not (Test-Path $DistDir)) { New-Item -ItemType Directory -Path $DistDir -Force | Out-Null }
$VersionName = (Select-String -Path "$ProjectRoot\android\app\build.gradle" -Pattern 'versionName "([^"]+)"').Matches[0].Groups[1].Value
$Out = "$DistDir\guanqi-xinjing-$VersionName.aab"
Copy-Item -Force $Aab $Out
Write-Host ""
Write-Host "DONE → $Out  ($([math]::Round((Get-Item $Out).Length / 1MB, 2)) MB)" -ForegroundColor Green
