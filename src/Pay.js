import React, { useState, useEffect } from "react";
import * as echarts from "echarts";
import moment from "moment";
import './Header.css';

const Pay = () => {
  const [showDetail, setShowDetail] = useState(false);
  const [showBar, setShowBar] = useState(false);
  const [curDetail, setCurDetail] = useState(null);
  const [datas, setDatas] = useState([]);
  const [tags, setTags] = useState([]);
  const [startMoment, setStartMoment] = useState(
    moment().startOf("day").format("YYYY-MM-DDTHH:mm")
  );
  const [endMoment, setEndMoment] = useState(
    moment().format("YYYY-MM-DDTHH:mm")
  );

  const getTasks = () => {
    fetch("http://localhost:3010/tasks/")
      .then((response) => response.json())
      .then((data) => {
        console.log("data = ", data);
        let needData = [];
        let needTags = [];
        data.forEach((element, index) => {
          let needItem = {
            task: element,
            records: [],
          };
          if (element.records) {
            element.records.forEach((item, i) => {
              let { startTime, endTime } = item;
              let validDuration = 0;
              if (!endTime) {
                endTime = moment().format("YYYY-MM-DD HH:mm:ss");
              }
              //1
              if (
                moment(startTime).diff(moment(startMoment), "s") < 0 &&
                moment(endTime).diff(moment(startMoment), "s") > 0 &&
                moment(endTime).diff(moment(endMoment), "s") <= 0
              ) {
                validDuration = moment(endTime).diff(moment(startMoment), "s");
                item.type = 1;
              }
              //2
              if (
                moment(startTime).diff(moment(startMoment), "s") >= 0 &&
                moment(endTime).diff(moment(endMoment), "s") <= 0
              ) {
                item.type = 2;
                validDuration = moment(endTime).diff(moment(startTime), "s");
              }
              //3
              if (
                moment(startTime).diff(moment(startMoment), "s") >= 0 &&
                moment(startTime).diff(moment(endMoment), "s") < 0 &&
                moment(endTime).diff(moment(endMoment), "s") >= 0
              ) {
                item.type = 3;
                validDuration = moment(endMoment).diff(moment(startTime), "s");
              }
              //4
              if (
                moment(startTime).diff(moment(startMoment), "s") < 0 &&
                moment(endTime).diff(moment(endMoment), "s") > 0
              ) {
                item.type = 4;
                validDuration = moment(endMoment).diff(
                  moment(startMoment),
                  "s"
                );
              }
              item.validDuration = validDuration;
              if (item.type) {
                needItem.records.push(item);
              }
            });
          }
          if (needItem.records.length) {
            needData.push(needItem);
            console.log("needItem = ", needItem);

            needItem.task.tags.forEach((tag) => {
              let index = -1;
              needTags.forEach((ele, eleIndex) => {
                if (tag === ele.tagName) {
                  index = eleIndex;
                }
              });
              if (index === -1) {
                needTags.push({
                  tagName: tag,
                  records: needItem.records,
                });
              } else {
                needTags[index].records = needTags[index].records.concat(
                  needItem.records
                );
              }
            });
          }
        });
        console.log("needData = ", needData);
        console.log("needTags = ", needTags);
        setDatas(needData);
        setTags(needTags);
      });
  };

  useEffect(() => {
    if (startMoment && endMoment) {
      if (moment(endMoment).diff(moment(startMoment)) <= 0) {
        alert("The end time must be greater than the start time!");
      } else {
        getTasks();
      }
    }
  }, [startMoment, endMoment]);

  const renderBar = () => {
    var chartDom = document.getElementById("chartBox");
    var myChart = echarts.init(chartDom);
    var option;
    let xData = curDetail.records.map((v) => {
      return `${v.startTime} ~ ${v.endTime}`;
    });
    let yData = curDetail.records.map((v) => {
      return v.validDuration;
    });
    option = {
      xAxis: {
        type: "category",
        data: xData,
        axisLabel: {
          interval: 0,
          formatter: function (value) {
            let data = value.split("~");
            return data[0] + "\n" + "~" + "\n" + data[1];
          },
        },
      },
      yAxis: {
        type: "value",
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
      },
      series: [
        {
          data: yData,
          type: "bar",
          barWidth: 30,
          showBackground: true,
          backgroundStyle: {
            color: "rgba(180, 180, 180, 0.2)",
          },
        },
      ],
    };

    option && myChart.setOption(option);
  };

  const responsiveStyle = {
    overlay: {
      width: "100%",
      height: "100vh",
      position: "fixed",
      left: 0,
      top: 0,
      background: "rgba(0,0,0,0.6)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "column",
    },
    chartBox: {
      width: "90%",
      maxWidth: 1000,
      height: 400,
      padding: 20,
      background: "#fff",
      marginBottom: 20,
    }
  };

  useEffect(() => {
    if (showBar && curDetail) {
      renderBar();
    }
  }, [curDetail, showBar]);
  console.log("cur = ", curDetail);

  return (
    <div>
      {showBar && (
        <div
        style={{
          width: "100%",
          height: "100vh",
          position: "fixed",
          left: 0,
          top: 0,
          background: "rgba(0,0,0,0.6)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          padding: "20px",
        }}
        >
          <h2
          style={{
            color: "white",
            margin: "0 0 20px 0",
          }}
          >
            Bar Chart
          </h2>

          <div
            id="chartBox"
            style={{
              width: "100%",
              maxWidth: "1000px",
              height: "400px",
              padding: "20px",
              background: "#fff",
              boxSizing: "border-box",
            }}
          ></div>

          <button
            style={{
            marginTop: "20px",
            padding: "10px 20px",
            }}
            onClick={() => {
              setShowBar(false);
            }}
          >
            Close
          </button>
        </div>
      )}
      {showDetail && (
        <div
        style={{
          width: "100%",
          height: "100vh",
          position: "fixed",
          left: 0,
          top: 0,
          background: "rgba(0,0,0,0.6)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          padding: "20px",
        }}
        >
          <h2
          style={{
            color: "white",
            margin: "0 0 20px 0",
          }}
          >
            Detail
          </h2>
          <div
          style={{
            width: "100%",
            overflowX: "auto",
          }}
        >
          <table
           style={{
            width: "100%",
            borderCollapse: "collapse",
            }}
          >
            <thead>
              <tr>
                <th
                  style={{
                  border: "1px solid #fff",
                  padding: "8px",
                  backgroundColor: "#4CAF50",
                  color: "white",
                  }}
                  >Start Time</th>
                <th
                  style={{
                    border: "1px solid #fff",
                    padding: "8px",
                    backgroundColor: "#4CAF50",
                    color: "white",
                  }}
                >End Time</th>
                 <th
                  style={{
                    border: "1px solid #fff",
                    padding: "8px",
                    backgroundColor: "#4CAF50",
                    color: "white",
                  }}
                >Durations(seconds)</th>
              </tr>
            </thead>
            <tbody>
              {curDetail?.records?.map((v, i) => {
                return (
                  <tr key={i}>
                  <td
                      style={{
                        border: "1px solid #ddd",
                        padding: "8px",
                      }}>{v.startTime}</td>
                    <td
                      style={{
                        border: "1px solid #ddd",
                        padding: "8px",
                      }}
                    >{v.endTime}</td>
                     <td
                      style={{
                        border: "1px solid #ddd",
                        padding: "8px",
                      }}
                    >{v.validDuration}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <button
                    style={{
                      marginTop: "20px",
                      padding: "10px 20px",
                    }}
            onClick={() => {
              setShowDetail(false);
            }}
          >
            Close
          </button>
        </div>
        </div>
      )}

      <div>
        <label> Start Moment: </label>{" "}
        <input
          type="datetime-local"
          value={startMoment}
          onChange={(e) => setStartMoment(e.target.value)}
        />
        <label> End Moment: </label>{" "}
        <input
          type="datetime-local"
          value={endMoment}
          onChange={(e) => setEndMoment(e.target.value)}
        />{" "}
      </div>
      <div>
      <div className="icon-and-title">
    <span className="material-symbols-outlined">
      interests
    </span>
    <h3>Tasks of Interest:</h3>
    </div>
        <ul>
          {" "}
          {datas.map((item, index) => {
            let totalTime = 0;
            item.records.forEach((v) => {
              totalTime += v.validDuration;
            });
            return (
              <li
                key={index}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginBottom: 15,
                }}
              >
                {item.task.name} - Total Active Time:
                <span
                  style={{
                    margin: "0 20px",
                  }}
                >
                  {totalTime}{" "}
                </span>
                seconds
                <div>
                  <button
                    onClick={() => {
                      setShowDetail(true);
                      setCurDetail(item);
                    }}
                    style={{
                      margin: "0 20px",
                    }}
                  >
                    Detail
                  </button>
                  <button
                    onClick={() => {
                      setShowBar(true);
                      setCurDetail(item);
                    }}
                  >
                    Bar Chart
                  </button>
                </div>
              </li>
            );
          })}{" "}
        </ul>{" "}
      </div>
      <div>
      <div className="icon-and-title">
    <span className="material-symbols-outlined">
      interests
    </span>
    <h3>Tags of Interest:</h3>
    </div>

        <ul>
          {" "}
          {tags.map((tag, index) => {
            let totalTime = 0;
            tag.records.forEach((v) => {
              totalTime += v.validDuration;
            });
            return (
              <li key={index}>
                {" "}
                {tag.tagName}- Total Active Time:
                <span
                  style={{
                    margin: "0 20px",
                  }}
                >
                  {totalTime}{" "}
                </span>
                seconds
              </li>
            );
          })}{" "}
        </ul>{" "}
      </div>{" "}
    </div>
  );
};

export default Pay;
