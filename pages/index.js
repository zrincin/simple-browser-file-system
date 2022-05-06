import { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { Container, Button } from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";
import { buildFilesPath, extractFiles } from "./api/_helper-functions";
import fs from "fs";
import path from "path";

export default function HomePage(props) {
  const { files } = props;

  const [showFiles, setShowFiles] = useState(true);
  const router = useRouter();

  const hasFiles = files && files.length !== 0;

  const deleteFileHandler = (id) => {
    fetch(`/api/files/deleteFiles/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => console.log(data));
    router.replace("/");
  };

  useEffect(() => {
    router.push("/");
  }, [router.query]);

  return (
    <>
      <Head>
        <title>Folder Browser</title>
      </Head>
      <Container style={{ marginTop: 20 }}>
        <h3>My Files:</h3>
        {showFiles && (
          <ul>
            {files.map(({ id, filename, filetype }) => (
              <li key={id}>
                {filename}
                {filetype}
                <div
                  style={{
                    marginLeft: 10,
                    marginBottom: 5,
                    display: "inline-flex",
                  }}
                >
                  <Button
                    inverted
                    color="red"
                    size="mini"
                    onClick={() => deleteFileHandler(id)}
                  >
                    Delete
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
        {!hasFiles && "No files found"}
        <div style={{ marginBottom: 10 }} />
        {hasFiles ? (
          <Button
            secondary
            size="small"
            onClick={() => setShowFiles(!showFiles)}
          >
            {!showFiles ? "Show files" : "Hide files"}
          </Button>
        ) : null}
        <Button primary size="small" onClick={() => router.push("/newFile")}>
          Create a new file
        </Button>
        {hasFiles ? (
          <Button
            color="red"
            size="small"
            onClick={() => router.push("/api/files/deleteFiles/deleteAllFiles")}
          >
            Delete all files
          </Button>
        ) : null}
      </Container>
    </>
  );
}

export async function getServerSideProps() {
  let filePath = buildFilesPath();

  if (!filePath || !fs.existsSync(filePath)) {
    fs.mkdirSync(path.join(process.cwd(), "data"));
    fs.writeFileSync(path.join(process.cwd(), "data", "files.json"), "[]");
    filePath = buildFilesPath();
  }

  const data = extractFiles(filePath);

  return {
    props: {
      files: data,
    },
  };
}
