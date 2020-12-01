import { FormControl, TextField } from "@material-ui/core";
import React, { useState, useEffect } from "react";
import { db } from "./firebase";
import FavoriteSharpIcon from '@material-ui/icons/FavoriteSharp';
import TaskItem from "./TaskItem.js";

const App = () => {
  // 1.データ追加
  const [data, setData] = useState([{ id: "", title: "", contents: "" }]);
  // インプット作成用の箱
  const [inputValue, setInputValue] = useState(""); //インプットが2つ以上の場合はそれぞれ作る必要あり
  // TextField入力時の処理
  const handleInputChange = (e) => { //eはeventの略
    console.log(e, "event");
    setInputValue(e.target.value); //inputValueに値を書き込む（更新）
  };
  // Button押した際の処理
  const addInputData = () => {
    db.collection("group").add({title: inputValue});
    setInputValue("");
  };

  // 2.最新データ取得
  useEffect(() => {
    const firebaseData = db
      .collection("group")
      .orderBy("title", "asc") //firebaseの逆三角見てもコードわかる
      .onSnapshot((snapshot) => { //SnapshotはDB側で変更があるとリアルタイムで変更される
          setData(
            snapshot.docs.map((dbData) => ({
              id: dbData.id,
              title: dbData.data().title,
              contents: dbData.data().contents,
            }))
          );
    });
    return () => firebaseData();
  }, []); //←ここに最後一つ書きたします
  // // ここに記述,useStateで作ったdata変数をコンソールログで表示
  // console.log(data);
  return (
    <div>
      <h1>一言タイトル</h1>
      {/* 登録の処理 */}
      <FormControl>
        {/* inputタグ */}
        <TextField
          label="登録追加"
          value={inputValue}
          onChange={handleInputChange}
        />
      </FormControl>
      <button 
        disabled={!inputValue}
        // 空のときは押せないようにしてる
        onClick={addInputData}> 
        <FavoriteSharpIcon/>
      </button>

      {/* dataっていう変数のなかに全てのデータが入っているのでmapを使って展開 */}
      {data.map((dataItem) => (
        // <div key={dataItem.id}>
        //   <h1>{dataItem.title}</h1>
        //   <h2>{dataItem.contents}</h2>
        // </div>
        <TaskItem id={dataItem.id} title={dataItem.title} contents = {dataItem.contents}/>
      ))}
    </div>
  );
};
export default App;