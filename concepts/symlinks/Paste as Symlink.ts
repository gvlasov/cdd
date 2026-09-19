// Static browsable reflection of Paste as Symlink.
export default [
  [
    {
      "kind": "identity",
      "value": "cdd.pasteAsSymlink"
    },
    {
      "kind": "concept",
      "value": "cdd.concept"
    },
    {
      "kind": "slug",
      "value": "pasteAsSymlink"
    },
    {
      "kind": "name",
      "value": "Paste as Symlink"
    },
    {
      "kind": "definition",
      "value": "Paste as Symlink is a user action for creating a symbolic link from an already selected or copied filesystem entry."
    },
    {
      "kind": "details",
      "value": "The intended flow is gesture-first:\n\n- user copies a file or directory\n- user selects the destination directory\n- user asks the tool to paste as symlink\n\nThis avoids asking the user to manually type or browse for both source and destination paths.\n\nIn JetBrains IDEs, the CDD plugin reflects this concept as a Project View context menu action."
    }
  ]
]
