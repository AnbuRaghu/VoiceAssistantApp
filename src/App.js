import React, { useEffect, useState } from "react";
import alanBtn from "@alan-ai/alan-sdk-web";
import NewsCards from "./Components/NewsCards/NewsCards";
import wordsToNumbers from "words-to-numbers";
import useStyles from "./styles.js";

const alanKey =
  "7b4d105e64271ee757264cfb575349702e956eca572e1d8b807a3e2338fdd0dc/stage";

export default function App() {
  const [newsArticles, setNewsArticles] = useState([]);
  const [activeArticle, setActiveArticle] = useState(-1); // index of the aricle being read
  const classes = useStyles();
  useEffect(() => {
    alanBtn({
      key: alanKey,
      onCommand: ({ command, articles, number }) => {
        if (command === "newsHeadlines") {
          //console.log(articles);
          setNewsArticles(articles);
          setActiveArticle(-1);
        } else if (command === "highlight") {
          // we get the prev state using callback and aadd + 1
          setActiveArticle((prevActiveArticle) => prevActiveArticle + 1);
        } else if (command === "open") {
          const parsedNumber =
            number.length > 2
              ? wordsToNumbers(number, { fuzzy: true })
              : number;
          const article = articles[parsedNumber - 1];

          if (parsedNumber > 20) {
            alanBtn().playText("Please try that again");
          } else if (article) {
            window.open(article.url, "_blank");
            alanBtn().playText("Opening.....");
          }
        }
      },
    });
  }, []);
  return (
    <div>
      <div>
        <h1
          style={{
            textAlign: "center",
            fontWeight: 800,
            fontSize: "3rem",
            color: "blue",
          }}
        >
          Voice Assistant
        </h1>
      </div>
      <div className={classes.logoContainer}>
        <img
          src="https://th.bing.com/th/id/OIP.BeP5NM_n4GZn_CzoYeRlDQHaFL?w=264&h=185&c=7&o=5&dpr=1.25&pid=1.7"
          className={classes.alanLogo}
          alt="alan logo"
        />
      </div>

      <NewsCards articles={newsArticles} activeArticle={activeArticle} />
    </div>
  );
}
