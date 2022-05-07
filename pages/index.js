import { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { Container, Button } from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";
import { MongoClient } from "mongodb";
const { MONGODB_URI } = require("../secrets.json");

export default function HomePage(props) {
  const { files } = props;
  const [fetchedData, setFetchedData] = useState(files);
  const [showFiles, setShowFiles] = useState(true);
  const router = useRouter();

  const hasFiles = files && files.length !== 0;

  const deleteFileHandler = (id) => {
    const reqBody = { fileID: files.id };
    fetch(`/api/files/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reqBody),
    });
    router.push("/");
  };

  const deleteAllFilesHandler = () => {
    fetch("/api/files", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    router.push("/");
  };

  useEffect(() => {
    fetch("/api/files")
      .then((res) => res.json())
      .then((data) => setFetchedData(data.files));
  }, [fetchedData]);

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
            onClick={() => deleteAllFilesHandler()}
          >
            Delete all files
          </Button>
        ) : null}
      </Container>
    </>
  );
}

export async function getServerSideProps() {
  const client = await MongoClient.connect(MONGODB_URI);
  const db = client.db();
  const filesCollection = db.collection("files");
  const files = await filesCollection.find().toArray();

  client.close();

  return {
    props: {
      files: files.map((file) => ({
        filename: file.filename,
        filetype: file.filetype,
        id: file._id.toString(),
      })),
    },
  };
}
