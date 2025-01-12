import React, { useRef, useState } from "react";
import DocViewer from "./DocViewer";
import { DocViewerRenderers } from "./renderers";

import pdfFile from "./exampleFiles/pdf-file.pdf";
import pdfMultiplePagesFile from "./exampleFiles/pdf-multiple-pages-file.pdf";
import pngFile from "./exampleFiles/png-image.png";
import csvFile from "./exampleFiles/csv-file.csv";
import epsFile from "./exampleFiles/eps-file.eps";
import { DocViewerRef, IDocument } from ".";

/* eslint-disable import/no-anonymous-default-export */
export default {
  title: "DocViewer",
};

const docs: IDocument[] = [
  { uri: pdfFile },
  { uri: pngFile },
  { uri: csvFile },
  { uri: pdfMultiplePagesFile },
];

export const Default = () => (
  <DocViewer
    documents={docs}
    initialActiveDocument={docs[1]}
    config={{
      pdfVerticalScrollByDefault: true,
      noRenderer: {
        overrideComponent: ({ document, fileName }) => {
          const fileText = fileName || document?.fileType || "";
          console.log(document);
          if (fileText) {
            return <div>no renderer for {fileText}</div>;
          }
          return <div>no renderer</div>;
        },
      },
      loadingRenderer: {
        overrideComponent: ({ document, fileName }) => {
          const fileText = fileName || document?.fileType || "";
          if (fileText) {
            return <div>loading ({fileText})</div>;
          }
          return <div>loading</div>;
        },
      },
      csvDelimiter: ",",
      pdfZoom: {
        defaultZoom: 1.1,
        zoomJump: 0.2,
      },
    }}
    language="pl"
  />
);

export const WithPDFInput = () => {
  const [selectedDocs, setSelectedDocs] = useState<File[]>([]);

  return (
    <>
      <input
        type="file"
        accept=".pdf"
        multiple
        onChange={(el) =>
          el.target.files?.length &&
          setSelectedDocs(Array.from(el.target.files))
        }
      />
      <DocViewer
        documents={selectedDocs.map((file) => ({
          uri: window.URL.createObjectURL(file),
          fileName: file.name,
        }))}
        pluginRenderers={DocViewerRenderers}
        config={{pdfVerticalScrollByDefault: true }}
      />
    </>
  );
};

export const ManualNextPrevNavigation = () => {
  const [activeDocument, setActiveDocument] = useState(docs[0]);

  const handleDocumentChange = (document: IDocument) => {
    setActiveDocument(document);
  };

  return (
    <>
      <DocViewer
        documents={docs}
        activeDocument={activeDocument}
        onDocumentChange={handleDocumentChange}
        config={{pdfVerticalScrollByDefault: true }}
      />
    </>
  );
};

export const WithRef = () => {
  const docViewerRef = useRef<DocViewerRef>(null);

  return (
    <>
      <div>
        <button onClick={() => docViewerRef?.current?.prev()}>
          Prev Document By Ref
        </button>
        <button onClick={() => docViewerRef?.current?.next()}>
          Next Document By Ref
        </button>
      </div>
      <DocViewer
        ref={docViewerRef}
        documents={docs}
        config={{pdfVerticalScrollByDefault: true, header: { disableHeader: true } }}
      />
    </>
  );
};

export const NoRenderType = () => {
    const docs = [{ uri: epsFile, fileType: "application/postscript" }];

    return (
        <DocViewer
            documents={docs}
            initialActiveDocument={docs[0]}
            pluginRenderers={DocViewerRenderers}
            language="en"
            config={{pdfVerticalScrollByDefault: true }}
        />
    );
};

export const RenderPdfType = () => {

    return (
        <DocViewer
            documents={docs}
            initialActiveDocument={docs[3]}
            pluginRenderers={DocViewerRenderers}
            config={{pdfVerticalScrollByDefault: true,pdfZoom: {
              defaultZoom: 0.5, 
              zoomJump: 0.2, 
            }, }}
        />
    );
};
