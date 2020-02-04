; Custom Installer for EdgeDeflector
; Once EdgeDeflector is installed notifies extension so it can bring up the success page
; Requires an EdgeDeflector (https://github.com/da2x/EdgeDeflector) binary to be placed alongside this script before running

;--------------------------------

!define PRODUCT "EdgeDeflector"

Name "${PRODUCT}"

OutFile "${PRODUCT}_install.exe"

; Default installation directory
InstallDir $PROGRAMFILES\${PRODUCT}

; Store install dir in the registry
InstallDirRegKey HKLM "Software\${PRODUCT}" "Install_Dir"

; Request application privileges for UAC
RequestExecutionLevel admin


;--------------------------------

; Installer pages
Page directory
Page instfiles

; Uninstaller pages
UninstPage uninstConfirm
UninstPage instfiles

;--------------------------------


Section "Installer"

  ; Set output path to the installation directory.
  SetOutPath $INSTDIR

  ; Put file there
  File ${PRODUCT}.exe

  ; Self-registeres to the registry
  ExecWait '$INSTDIR\${PRODUCT}.exe'

  ; Write the installation path to the registry
  WriteRegStr HKLM SOFTWARE\${PRODUCT} "Install_Dir" "$INSTDIR"
  
  ; Write the uninstall keys to the registry
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${PRODUCT}" "DisplayName" "${PRODUCT}"
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${PRODUCT}" "UninstallString" '"$INSTDIR\${PRODUCT}_uninstall.exe"'
  WriteRegDWORD HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${PRODUCT}" "NoModify" 1
  WriteRegDWORD HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${PRODUCT}" "NoRepair" 1
  WriteUninstaller "${PRODUCT}_uninstall.exe"
  
  ; Remove key that points to default program for opening microsoft-edge links
  DeleteRegKey HKCU "Software\Microsoft\Windows\Shell\Associations\UrlAssociations\microsoft-edge"
  
  ; Open a bing.com link, forcing windows to prompt for a new default program to open these links with. User should then pick Edge Deflector.
  ExecShell "open" "microsoft-edge:https://goo.gl/uqdeVK"
  
  ; Extension redirects user to success page indicating proper configuration
SectionEnd

;--------------------------------


Section "Uninstall"

  ; Remove registry keys
  DeleteRegKey HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${PRODUCT}"
  DeleteRegKey HKLM "SOFTWARE\${PRODUCT}"

  ; Remove files and uninstaller
  Delete $INSTDIR\${PRODUCT}.exe
  Delete $INSTDIR\${PRODUCT}_uninstall.exe
  
  ; Remove the key set by edge deflector
  DeleteRegKey HKCU "Software\Microsoft\Windows\Shell\Associations\UrlAssociations\microsoft-edge"
SectionEnd
