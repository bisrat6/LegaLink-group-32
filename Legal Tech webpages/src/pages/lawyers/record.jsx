import React, { useState } from "react";
import "../../assets/styles/lawyer homepage/record.css";
import Header from '../components/Navbar'
import Footer from '../components/Footer'
import LawyerNavbar from "../components/lawyerNavbar";
const initialCases = [
  {
    id: 1,
    clientName: "Alice Johnson",
    title: "Contract Dispute",
    description: "Client is disputing a contract breach with their supplier. Needs legal advice on next steps.",
    comments: [
      { id: 1, text: "Have you collected all communication records?" },
      { id: 2, text: "I recommend scheduling a consultation." },
    ],
  },
  {
    id: 2,
    clientName: "Bob Smith",
    title: "Personal Injury Claim",
    description: "Client was injured in a car accident and wants to claim compensation.",
    comments: [],
  },
];

function CaseFeed() {
  const [cases, setCases] = useState(initialCases);
  const [commentInputs, setCommentInputs] = useState({});

  const handleCommentChange = (caseId, text) => {
    setCommentInputs((prev) => ({ ...prev, [caseId]: text }));
  };

  const addComment = (caseId) => {
    const text = commentInputs[caseId]?.trim();
    if (!text) return;

    setCases((prevCases) =>
      prevCases.map((c) =>
        c.id === caseId
          ? {
              ...c,
              comments: [...c.comments, { id: Date.now(), text }],
            }
          : c
      )
    );
    setCommentInputs((prev) => ({ ...prev, [caseId]: "" }));
  };

  return (
    <>
    <LawyerNavbar/>
     <div className="caseFeedContainer">
      <h2>Posted Cases</h2>
      {cases.map((c) => (
        <div key={c.id} className="caseCard">
          <h3>{c.title}</h3>
          <p><strong>Client:</strong> {c.clientName}</p>
          <p>{c.description}</p>

          <div className="commentsSection">
            <h4>Comments</h4>
            {c.comments.length === 0 && <p>No comments yet.</p>}
            <ul className="commentsList">
              {c.comments.map((comment) => (
                <li key={comment.id} className="commentItem">
                  {comment.text}
                </li>
              ))}
            </ul>

            <input
              type="text"
              placeholder="Add a comment..."
              value={commentInputs[c.id] || ""}
              onChange={(e) => handleCommentChange(c.id, e.target.value)}
              className="commentInput"
              onKeyDown={(e) => e.key === "Enter" && addComment(c.id)}
            />
            <button onClick={() => addComment(c.id)} className="commentButton">
              Comment
            </button>
          </div>
        </div>
      ))}
    </div>
    <Footer />
    </>
   
  );
}

export default CaseFeed;