type FileDialogProperty =
  | 'openFile'
  | 'openDirectory'
  | 'multiSelections'
  | 'showHiddenFiles'
  | 'createDirectory'
  | 'promptToCreate'
  | 'noResolveAliases'
  | 'treatPackageAsDirectory'
  | 'dontAddToRecent';

export interface OptionsFileDialog {
  options: FileDialogProperty[];
  filters?: { extensions: string[]; name: string }[];
}
