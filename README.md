# PDF Selector

Minimal browser-based PDF text-run selector proof of concept. No application backend or database.

## Run

From the repository directory:

```powershell
py -m http.server 5500
```

Open http://localhost:5500 in Chrome or Edge. Requires internet access to load the pinned PDF.js modules from jsDelivr.

## First experiment

1. Open a PDF containing selectable text.
2. Hover over text runs to highlight them.
3. Click a run to inspect its value, page and coordinates.
4. Test page navigation and zoom, and copy the selection JSON.

Coordinates are relative to the PDF.js page viewport at scale 1, independent of zoom. They are not raw PDF bottom-left coordinates. PDF.js text runs are not guaranteed to match individual words. Scanned PDFs, images, annotations and form fields are outside this first experiment.

## Architecture

- `src/core/pdf-engine.js`: PDF loading/rendering
- `src/core/element-detector.js`: text run extraction and geometry
- `src/core/element-selector.js`: selection data contract
- `src/web/`: browser-only UI

Instructor, Learner and SQLite are intentionally not implemented. They can later consume a refined shared selection contract.
