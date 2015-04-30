{
  "targets": [
    {
      "target_name": "saphire",
      "sources": [ "src/saphire.cc" ],
      "include_dirs": [
        "<!(node -e \"require('nan')\")"
      ]
    }
  ]
}
