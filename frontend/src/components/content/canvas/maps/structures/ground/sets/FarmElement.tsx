import { number } from "prop-types";
import { Alley_stones } from "../elements/Alley_stones";
import { Axe } from "../elements/Axe";
import { Barn } from "../elements/Barn";
import { Barrel } from "../elements/Barrel";
import { Barrel_2 } from "../elements/Barrel_2";
import { Bench_2 } from "../elements/Bench_2";
import { Bridge_1 } from "../elements/Bridge_1";
import { Bridge_2 } from "../elements/Bridge_2";
import { Building_1 } from "../elements/Building_1";
import { Building_2 } from "../elements/Building_2";
import { Building_3 } from "../elements/Building_3";
import { Bush } from "../elements/Bush";
import { Bush_1 } from "../elements/Bush_1";
import { Bush_2 } from "../elements/Bush_2";
import { Bush_3 } from "../elements/Bush_3";
import { Bush_4 } from "../elements/Bush_4";
import { Bush_5 } from "../elements/Bush_5";
import { Bush_6 } from "../elements/Bush_6";
import { Carrot } from "../elements/Carrot";
import { Chair } from "../elements/Chair";
import { Chalk_Board } from "../elements/Chalk_Board";
import { Chicken_coop } from "../elements/Chicken_coop";
import { Dog_house } from "../elements/Dog_house";
import { Dumpster } from "../elements/Dumpster";
import { Fence } from "../elements/Fence";
import { Flower_pot } from "../elements/Flower_pot";
import { Fork_2 } from "../elements/Fork_2";
import { Grass } from "../elements/Grass";
import { Grave_1 } from "../elements/Grave_1";
import { Grave_2 } from "../elements/Grave_2";
import { Hay_1 } from "../elements/Hay_1";
import { Hay_2 } from "../elements/Hay_2";
import { House_1 } from "../elements/House_1";
import { House_2 } from "../elements/House_2";
import { House_3 } from "../elements/House_3";
import { House_4 } from "../elements/House_4";
import { House_5 } from "../elements/House_5";
import { House_6 } from "../elements/House_6";
import { House_7 } from "../elements/House_7";
import { Light_pole_1 } from "../elements/Light_pole_1";
import { Light_pole_2 } from "../elements/Light_pole_2";
import { Logs } from "../elements/Logs";
import { Pig } from "../elements/Pig";
import { Pumpkin } from "../elements/Pumpkin";
import { Road_1 } from "../elements/Road_1";
import { Road_2 } from "../elements/Road_2";
import { Rock } from "../elements/Rock";
import { Scythe } from "../elements/Scythe";
import { Seesaw } from "../elements/Seesaw";
import { Sheep } from "../elements/Sheep";
import { Swing } from "../elements/Swing";
import { Table_1 } from "../elements/Table_1";
import { Table_2 } from "../elements/Table_2";
import { Traffic_light_1 } from "../elements/Traffic_light_1";
import { Traffic_light_2 } from "../elements/Traffic_light_2";
import { Tree_1 } from "../elements/Tree_1";
import { Tree_2 } from "../elements/Tree_2";
import { Tree_4 } from "../elements/Tree_4";
import { Tree_5 } from "../elements/Tree_5";
import { Tree_6 } from "../elements/Tree_6";
import { Tree_7 } from "../elements/Tree_7";
import { Tree_9 } from "../elements/Tree_9";
import { Tree_house_trunk } from "../elements/Tree_house_trunk";
import { Tree_trunk } from "../elements/Tree_trunk";
import { Wheelbarrow } from "../elements/Wheelbarrow";
import { Wooden_box } from "../elements/Wooden_box";
import { useSelector } from 'react-redux';

export function FarmElement() {

  // currentRoom에서 gameinit에서 받은 mapValue를 가져와서 변수로 지정한다.
  const mapValue = useSelector(
    (state: any) => state.reduxFlag.userSlice.currentRoom.mapValue? state.reduxFlag.userSlice.currentRoom.mapValue:30
  );
  
  // .env의 난수를 가져와서 배열로 만들고, mapValue부터 일정개수를 사용하므로 모두가 같은 수들을 사용하게 된다.
  const randomNumber = import.meta.env.VITE_REACT_RANDOM_NUMBER.split("").map(
    Number
  );

  return (
    <>
      {/* --------------------------------<교차로>-------------------------------------- */}
      {/* 9<=x<=84 y=0 */}
      {/* <Road_1
        position={[0, 0.5, 85]}
        rotation={[-Math.PI / 2, 0, Math.PI / 2]}
      /> 
      <Road_1
        position={[0, 0.5, 84.5]}
        rotation={[-Math.PI / 2, 0, Math.PI / 2]}
      />
      <Road_1
        position={[0, 0.5, 81.5]}
        rotation={[-Math.PI / 2, 0, Math.PI / 2]}
      />*/}
      <Road_1
        position={[0, 0.5, 72.5]}
        rotation={[-Math.PI / 2, 0, Math.PI / 2]}
      />
      <Road_1
        position={[0, 0.5, 63.5]}
        rotation={[-Math.PI / 2, 0, Math.PI / 2]}
      />
      <Road_1
        position={[0, 0.5, 54.5]}
        rotation={[-Math.PI / 2, 0, Math.PI / 2]}
      />
      <Road_1
        position={[0, 0.5, 45.5]}
        rotation={[-Math.PI / 2, 0, Math.PI / 2]}
      />
      <Road_1
        position={[0, 0.5, 36.5]}
        rotation={[-Math.PI / 2, 0, Math.PI / 2]}
      />
      <Road_1
        position={[0, 0.5, 27.5]}
        rotation={[-Math.PI / 2, 0, Math.PI / 2]}
      />
      <Road_1
        position={[0, 0.5, 18.5]}
        rotation={[-Math.PI / 2, 0, Math.PI / 2]}
      />
      <Road_1
        position={[0, 0.5, 9]}
        rotation={[-Math.PI / 2, 0, Math.PI / 2]}
      />
      {/* 원점 x=0, y=0 */}
      <Road_2
        position={[0, 0.5, 0]}
        rotation={[-Math.PI / 2, 0, Math.PI / 2]}
      />
      {/* -9<=x<=-84 y=0 */}
      {/* <Road_1
        position={[0, 0.5, -85]}
        rotation={[-Math.PI / 2, 0, Math.PI / 2]}
      /> 
      <Road_1
        position={[0, 0.5, -84.5]}
        rotation={[-Math.PI / 2, 0, Math.PI / 2]}
      />
      <Road_1
        position={[0, 0.5, -81.5]}
        rotation={[-Math.PI / 2, 0, Math.PI / 2]}
      />*/}
      <Road_1
        position={[0, 0.5, -72.5]}
        rotation={[-Math.PI / 2, 0, Math.PI / 2]}
      />
      <Road_1
        position={[0, 0.5, -63.5]}
        rotation={[-Math.PI / 2, 0, Math.PI / 2]}
      />
      <Road_1
        position={[0, 0.5, -54.5]}
        rotation={[-Math.PI / 2, 0, Math.PI / 2]}
      />
      <Road_1
        position={[0, 0.5, -45.5]}
        rotation={[-Math.PI / 2, 0, Math.PI / 2]}
      />
      <Road_1
        position={[0, 0.5, -36.5]}
        rotation={[-Math.PI / 2, 0, Math.PI / 2]}
      />
      <Road_1
        position={[0, 0.5, -27.5]}
        rotation={[-Math.PI / 2, 0, Math.PI / 2]}
      />
      <Road_1
        position={[0, 0.5, -18.5]}
        rotation={[-Math.PI / 2, 0, Math.PI / 2]}
      />
      <Road_1
        position={[0, 0.5, -9]}
        rotation={[-Math.PI / 2, 0, Math.PI / 2]}
      />
      {/* x=0 -84<=y<=-9 */}
      {/* <Road_1 position={[-85, 0.5, 0]} rotation={[-Math.PI / 2, 0, 0]} />
      <Road_1 position={[-81.5, 0.5, 0]} rotation={[-Math.PI / 2, 0, 0]} /> */}
      <Road_1 position={[-72.5, 0.5, 0]} rotation={[-Math.PI / 2, 0, 0]} />
      <Road_1 position={[-63.5, 0.5, 0]} rotation={[-Math.PI / 2, 0, 0]} />
      <Road_1 position={[-54.5, 0.5, 0]} rotation={[-Math.PI / 2, 0, 0]} />
      <Road_1 position={[-45.5, 0.5, 0]} rotation={[-Math.PI / 2, 0, 0]} />
      <Road_1 position={[-36.5, 0.5, 0]} rotation={[-Math.PI / 2, 0, 0]} />
      <Road_1 position={[-27.5, 0.5, 0]} rotation={[-Math.PI / 2, 0, 0]} />
      <Road_1 position={[-18.5, 0.5, 0]} rotation={[-Math.PI / 2, 0, 0]} />
      <Road_1 position={[-9, 0.5, 0]} rotation={[-Math.PI / 2, 0, 0]} />

      {/* x=0 9<=y<=84 */}
      {/* <Road_1 position={[-85, 0.5, 0]} rotation={[-Math.PI / 2, 0, 0]} />
      <Road_1 position={[81.5, 0.5, 0]} rotation={[-Math.PI / 2, 0, 0]} /> */}
      <Road_1 position={[72.5, 0.5, 0]} rotation={[-Math.PI / 2, 0, 0]} />
      <Road_1 position={[63.5, 0.5, 0]} rotation={[-Math.PI / 2, 0, 0]} />
      <Road_1 position={[54.5, 0.5, 0]} rotation={[-Math.PI / 2, 0, 0]} />
      <Road_1 position={[45.5, 0.5, 0]} rotation={[-Math.PI / 2, 0, 0]} />
      <Road_1 position={[36.5, 0.5, 0]} rotation={[-Math.PI / 2, 0, 0]} />
      <Road_1 position={[27.5, 0.5, 0]} rotation={[-Math.PI / 2, 0, 0]} />
      <Road_1 position={[18.5, 0.5, 0]} rotation={[-Math.PI / 2, 0, 0]} />
      <Road_1 position={[9, 0.5, 0]} rotation={[-Math.PI / 2, 0, 0]} />

      {/* 랜덤 신호등 */}
      {/* 의자 랜덤 */}
      {(() => {
        const x_list = [
          73, 64, 55, 46, 37, 28, 19, 9, -10, -19, -28, -37, -46, -55, -64, -73,
          73, 64, 55, 46, 37, 28, 19, 9, -10, -19, -28, -37, -46, -55, -64, -73,
          5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, -5, -5, -5, -5, -5,
          -5, -5, -5, -5, -5, -5, -5, -5, -5, -5, -5,
        ];
        const y_list = [
          5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, -5, -5, -5, -5, -5,
          -5, -5, -5, -5, -5, -5, -5, -5, -5, -5, -5, 73, 64, 55, 46, 37, 28,
          19, 9, -10, -19, -28, -37, -46, -55, -64, -73, 73, 64, 55, 46, 37, 28,
          19, 9, -10, -19, -28, -37, -46, -55, -64, -73,
        ];
        const p_list = [Math.PI, 0, -Math.PI / 2, Math.PI / 2];
        const p_list_traffic_light2 = [-Math.PI / 2, Math.PI / 2, 0, Math.PI];
        let item = [];
        for (let i = 0; i < x_list.length; i++) {
          let cnt = randomNumber[mapValue + i];
          if (cnt < 2) {
            item.push(
              <Traffic_light_1
                key={"Traffic_light_1 : " + i}
                position={[x_list[i], 0.5, y_list[i]]}
                rotation={[-Math.PI / 2, 0, p_list[Math.floor(i / 16)]]}
              />
            );
          } else if (cnt < 4) {
            item.push(
              <Traffic_light_2
                key={"traffic light_2 : " + i}
                position={[x_list[i], 0.5, y_list[i]]}
                rotation={[
                  -Math.PI / 2,
                  0,
                  p_list_traffic_light2[Math.floor(i / 16)],
                ]}
              />
            );
          } else if (cnt < 6) {
            item.push(
              <Light_pole_1
                key={"Light_pole_1 : " + i}
                position={[x_list[i], 0.5, y_list[i]]}
                rotation={[-Math.PI / 2, 0, p_list[Math.floor(i / 16)]]}
              />
            );
          }
        }
        return item;
      })()}

      {/* --------------------------------<1사분면 x>0, y>0 : 농장>-------------------------------------- */}

      {/* Barn */}
      {(() => {
        let item = [];
        for (let i = 0; i < 4; i++) {
          item.push(
            <Barn
              key={"Barn : " + i}
              position={[27, 0.5, 21 + 13 * i]}
              rotation={[-Math.PI / 2, 0, -Math.PI / 2]}
            />
          );
        }
        return item;
      })()}

      {/* 양 목장 펜스 */}
      <Fence
        position={[45, 0.5, 18]}
        rotation={[-Math.PI / 2, 0, -Math.PI / 2]}
      />
      <Fence
        position={[54, 0.5, 18]}
        rotation={[-Math.PI / 2, 0, -Math.PI / 2]}
      />
      <Fence
        position={[63, 0.5, 18]}
        rotation={[-Math.PI / 2, 0, -Math.PI / 2]}
      />
      <Fence
        position={[45, 0.5, 36]}
        rotation={[-Math.PI / 2, 0, -Math.PI / 2]}
      />
      <Fence
        position={[54, 0.5, 36]}
        rotation={[-Math.PI / 2, 0, -Math.PI / 2]}
      />
      <Fence
        position={[63, 0.5, 36]}
        rotation={[-Math.PI / 2, 0, -Math.PI / 2]}
      />
      <Fence
        position={[40.5, 0.5, 22.5]}
        rotation={[-Math.PI / 2, 0, -Math.PI / 1]}
      />
      <Fence
        position={[40.5, 0.5, 31.5]}
        rotation={[-Math.PI / 2, 0, -Math.PI / 1]}
      />
      <Fence
        position={[67.5, 0.5, 22.5]}
        rotation={[-Math.PI / 2, 0, -Math.PI / 1]}
      />
      <Fence
        position={[67.5, 0.5, 31.5]}
        rotation={[-Math.PI / 2, 0, -Math.PI / 1]}
      />

      {/* 양 */}
      {(() => {
        let item = [];
        for (let i = 0; i < 8; i++) {
          for (let j = 0; j < 13; j++) {
            let cnt = randomNumber[mapValue + i * 13 + j + 104];
            if (cnt < 2) {
              item.push(
                <Sheep
                  key={"Sheep : " + mapValue + i * 13 + j + 104}
                  position={[42 + j * 2, 0.5, 20 + i * 2]}
                  rotation={[-Math.PI / 2, 0, (-Math.PI * i) / j]}
                />
              );
            }
          }
        }
        return item;
      })()}

      {/* 돼지 목장 펜스 */}
      <Fence
        position={[45, 0.5, 45]}
        rotation={[-Math.PI / 2, 0, -Math.PI / 2]}
      />
      <Fence
        position={[54, 0.5, 45]}
        rotation={[-Math.PI / 2, 0, -Math.PI / 2]}
      />
      <Fence
        position={[63, 0.5, 45]}
        rotation={[-Math.PI / 2, 0, -Math.PI / 2]}
      />
      <Fence
        position={[45, 0.5, 63]}
        rotation={[-Math.PI / 2, 0, -Math.PI / 2]}
      />
      <Fence
        position={[54, 0.5, 63]}
        rotation={[-Math.PI / 2, 0, -Math.PI / 2]}
      />
      <Fence
        position={[63, 0.5, 63]}
        rotation={[-Math.PI / 2, 0, -Math.PI / 2]}
      />
      <Fence
        position={[40.5, 0.5, 49.5]}
        rotation={[-Math.PI / 2, 0, -Math.PI / 1]}
      />
      <Fence
        position={[40.5, 0.5, 58.5]}
        rotation={[-Math.PI / 2, 0, -Math.PI / 1]}
      />
      <Fence
        position={[67.5, 0.5, 49.5]}
        rotation={[-Math.PI / 2, 0, -Math.PI / 1]}
      />
      <Fence
        position={[67.5, 0.5, 58.5]}
        rotation={[-Math.PI / 2, 0, -Math.PI / 1]}
      />

      {/* 돼지 */}
      {(() => {
        let item = [];
        for (let i = 0; i < 8; i++) {
          for (let j = 0; j < 13; j++) {
            let cnt = randomNumber[mapValue + i * 8 + j];
            if (cnt < 2) {
              item.push(
                <Pig
                  key={"Pig : " + mapValue + i * 8 + j}
                  position={[42 + j * 2, 0.5, 47 + i * 2]}
                  rotation={[-Math.PI / 2, 0, (-Math.PI * i) / j]}
                />
              );
            }
          }
        }
        return item;
      })()}

      {/* 맵전체 */}
      {(() => {
        let item = [];
        for (let i = 0; i < 8; i++) {
          for (let j = 0; j < 8; j++) {
            let cnt = randomNumber[mapValue + i * 8 + j];
            if (cnt < 1) {
              item.push(
                <Flower_pot
                  key={"Flower_pot : " + mapValue + i * 8 + j}
                  position={[15 + i * 8, 0.5, 5 + j * 8]}
                  rotation={[-Math.PI / 2, 0, (-Math.PI * i) / j]}
                />
              );
            } else if (cnt < 2) {
              item.push(
                <Tree_trunk
                  key={"Tree_trunk : " + mapValue + i * 8 + j}
                  position={[15 + i * 8, 0.5, 5 + j * 8]}
                  rotation={[-Math.PI / 2, 0, (-Math.PI * i) / j]}
                />
              );
            } else if (cnt < 3) {
              item.push(
                <Pumpkin
                  key={"Pumpkin : " + mapValue + i * 8 + j}
                  position={[15 + i * 8, 0.5, 5 + j * 8]}
                  rotation={[-Math.PI / 2, 0, (-Math.PI * i) / j]}
                />
              );
            }
          }
        }
        return item;
      })()}

      <Wheelbarrow position={[15, 0.5, 15]} rotation={[-Math.PI / 2, 0, 0]} />
      <Wheelbarrow position={[35, 0.5, 70]} rotation={[-Math.PI / 2, 0, 0]} />
      <Bush position={[10, 0.5, 10]} rotation={[-Math.PI / 2, 0, 0]} />
      <Bush_1 position={[10, 0.5, 41]} rotation={[-Math.PI / 2, 0, 0]} />
      <Bush_2 position={[17, 0.5, 68]} rotation={[-Math.PI / 2, 0, 0]} />
      <Bush_3 position={[10, 0.5, 10]} rotation={[-Math.PI / 2, 0, 0]} />
      <Bush_4 position={[55, 0.5, 41]} rotation={[-Math.PI / 2, 0, 0]} />
      <Bush_5 position={[38, 0.5, 11]} rotation={[-Math.PI / 2, 0, 0]} />
      <Bush_6 position={[15, 0.5, 30]} rotation={[-Math.PI / 2, 0, 0]} />

      {/* --------------------------------<2사분면 x<0, y>0: 주거지역>-------------------------------------- */}

      <Tree_4 position={[10, 0.5, -10]} rotation={[-Math.PI / 2, 0, 0]} />
      <Tree_4 position={[10, 0.5, -20]} rotation={[-Math.PI / 2, 0, 0]} />
      <Tree_4 position={[10, 0.5, -30]} rotation={[-Math.PI / 2, 0, 0]} />
      <Tree_4 position={[10, 0.5, -40]} rotation={[-Math.PI / 2, 0, 0]} />
      <Tree_4 position={[10, 0.5, -50]} rotation={[-Math.PI / 2, 0, 0]} />
      <Tree_4 position={[10, 0.5, -60]} rotation={[-Math.PI / 2, 0, 0]} />
      <Tree_4 position={[10, 0.5, -70]} rotation={[-Math.PI / 2, 0, 0]} />
      {/* <Tree_4 position={[10, 0.5, -80]} rotation={[-Math.PI / 2, 0, 0]} /> */}

      <Tree_4 position={[10, 0.5, -10]} rotation={[-Math.PI / 2, 0, 0]} />
      <Tree_4 position={[20, 0.5, -10]} rotation={[-Math.PI / 2, 0, 0]} />
      <Tree_4 position={[30, 0.5, -10]} rotation={[-Math.PI / 2, 0, 0]} />
      <Tree_4 position={[40, 0.5, -10]} rotation={[-Math.PI / 2, 0, 0]} />
      <Tree_4 position={[50, 0.5, -10]} rotation={[-Math.PI / 2, 0, 0]} />
      <Tree_4 position={[60, 0.5, -10]} rotation={[-Math.PI / 2, 0, 0]} />
      <Tree_4 position={[70, 0.5, -10]} rotation={[-Math.PI / 2, 0, 0]} />
      {/* <Tree_4 position={[80, 0.5, -10]} rotation={[-Math.PI / 2, 0, 0]} /> */}

      {/* 집 랜덤 */}
      {(() => {
        const x_list = [-20, -20, -40, -60];
        const y_list = [30, 50, 30, 30];
        const p_list = [0, 0, -Math.PI / 2, -Math.PI / 2];
        let item = [];
        for (let i = 0; i < 4; i++) {
          let cnt = randomNumber[mapValue + i];
          if (cnt < 2) {
            item.push(
              <House_3
                key={"House_3 : " + i}
                position={[y_list[i], 0.5, x_list[i]]}
                rotation={[-Math.PI / 2, 0, p_list[i]]}
              />
            );
          } else if (cnt < 4) {
            item.push(
              <House_4
                key={"House_4 : " + i}
                position={[y_list[i], 0.5, x_list[i]]}
                rotation={[-Math.PI / 2, 0, p_list[i]]}
              />
            );
          } else if (cnt < 6) {
            item.push(
              <House_5
                key={"House_5 : " + i}
                position={[y_list[i], 0.5, x_list[i]]}
                rotation={[-Math.PI / 2, 0, p_list[i]]}
              />
            );
          } else {
            item.push(
              <House_7
                key={"House_7 : " + i}
                position={[y_list[i], 0.5, x_list[i]]}
                rotation={[-Math.PI / 2, 0, p_list[i]]}
              />
            );
          }
        }
        return item;
      })()}

      <Bridge_1
        position={[50, 0.5, -40]}
        rotation={[-Math.PI / 2, 0, -Math.PI / 2]}
      />
      <Bush_4
        position={[45, 0.5, -40]}
        rotation={[-Math.PI / 2, 0, -Math.PI / 2]}
      />
      <Bush_4
        position={[55, 0.5, -40]}
        rotation={[-Math.PI / 2, 0, -Math.PI / 2]}
      />

      <Swing
        position={[55, 0.5, -50]}
        rotation={[-Math.PI / 2, 0, -Math.PI / 2]}
      />

      <Seesaw position={[45, 0.5, -55]} rotation={[-Math.PI / 2, 0, 0]} />

      <Table_1 position={[40, 0.5, -51]} rotation={[-Math.PI / 2, 0, 0]} />
      <Table_1 position={[40, 0.5, -50]} rotation={[-Math.PI / 2, 0, 0]} />
      <Table_1 position={[40, 0.5, -49]} rotation={[-Math.PI / 2, 0, 0]} />
      <Table_1 position={[39, 0.5, -49]} rotation={[-Math.PI / 2, 0, 0]} />
      <Table_1 position={[39, 0.5, -50]} rotation={[-Math.PI / 2, 0, 0]} />
      <Table_1 position={[39, 0.5, -51]} rotation={[-Math.PI / 2, 0, 0]} />

      <Tree_house_trunk
        position={[60, 0.5, -65]}
        rotation={[-Math.PI / 2, 0, 0]}
      />
      {/* 나무집 근처 밴치 랜덤 */}
      {(() => {
        const y_list = [44, 46, 48, 50];
        let item = [];
        for (let i = 0; i < 6; i++) {
          let cnt = randomNumber[mapValue + i];
          if (cnt < 5) {
            item.push(
              <Bench_2
                key={"Bench_2 : " + i}
                position={[y_list[i], 0.5, -65]}
                rotation={[-Math.PI / 2, 0, -Math.PI / 2]}
              />
            );
          } else {
            item.push(
              <Light_pole_1
                key={"Light_pole_1 : " + i}
                position={[y_list[i], 0.5, -65]}
                rotation={[-Math.PI / 2, 0, -Math.PI / 2]}
              />
            );
          }
        }
        return item;
      })()}

      {/* 앞쪽 밴치 랜덤 */}
      {(() => {
        const x_list = [-50, -52, -48, -32, -30, -28];
        let item = [];
        for (let i = 0; i < 6; i++) {
          let cnt = randomNumber[mapValue + i];
          if (cnt < 5) {
            item.push(
              <Bench_2
                key={"Bench_2 : " + i}
                position={[30, 0.5, x_list[i]]}
                rotation={[-Math.PI / 2, 0, -Math.PI]}
              />
            );
          } else {
            item.push(
              <Light_pole_1
                key={"Light_pole_1 : " + i}
                position={[30, 0.5, x_list[i]]}
                rotation={[-Math.PI / 2, 0, -Math.PI]}
              />
            );
          }
        }
        return item;
      })()}

      {/* --------------------------------<3사분면 x<0, y<0 : 도시 및 카페>-------------------------------------- */}

      <Tree_4 position={[-10, 0.5, -10]} rotation={[-Math.PI / 2, 0, 0]} />
      <Tree_4 position={[-10, 0.5, -20]} rotation={[-Math.PI / 2, 0, 0]} />
      <Tree_4 position={[-10, 0.5, -30]} rotation={[-Math.PI / 2, 0, 0]} />
      <Tree_4 position={[-10, 0.5, -40]} rotation={[-Math.PI / 2, 0, 0]} />
      <Tree_4 position={[-10, 0.5, -50]} rotation={[-Math.PI / 2, 0, 0]} />
      <Tree_4 position={[-10, 0.5, -60]} rotation={[-Math.PI / 2, 0, 0]} />
      <Tree_4 position={[-10, 0.5, -70]} rotation={[-Math.PI / 2, 0, 0]} />
      {/* <Tree_4 position={[-10, 0.5, -80]} rotation={[-Math.PI / 2, 0, 0]} /> */}

      <Tree_4 position={[-10, 0.5, -10]} rotation={[-Math.PI / 2, 0, 0]} />
      <Tree_4 position={[-20, 0.5, -10]} rotation={[-Math.PI / 2, 0, 0]} />
      <Tree_4 position={[-30, 0.5, -10]} rotation={[-Math.PI / 2, 0, 0]} />
      <Tree_4 position={[-40, 0.5, -10]} rotation={[-Math.PI / 2, 0, 0]} />
      <Tree_4 position={[-50, 0.5, -10]} rotation={[-Math.PI / 2, 0, 0]} />
      <Tree_4 position={[-60, 0.5, -10]} rotation={[-Math.PI / 2, 0, 0]} />
      <Tree_4 position={[-70, 0.5, -10]} rotation={[-Math.PI / 2, 0, 0]} />
      {/* <Tree_4 position={[-80, 0.5, -10]} rotation={[-Math.PI / 2, 0, 0]} /> */}

      <Building_2 position={[-30, 0.5, -30]} rotation={[-Math.PI / 2, 0, 0]} />
      <Building_3 position={[-40, 0.5, -30]} rotation={[-Math.PI / 2, 0, 0]} />
      <Building_2 position={[-60, 0.5, -30]} rotation={[-Math.PI / 2, 0, 0]} />

      {/* 카페 */}
      <Building_3
        position={[-50, 0.5, -30]}
        rotation={[-Math.PI / 2, 0, -Math.PI]}
      />
      <Chalk_Board position={[-52, 0.5, -35]} rotation={[-Math.PI / 2, 0, 0]} />

      {/* 의자 랜덤 */}
      {(() => {
        const x_list = [-40, -45, -50];
        const y_list = [
          -29, -31, -33, -35, -37, -39, -41, -43, -45, -47, -49, -51, -53, -55,
        ];
        const p_list = [Math.PI, 0];
        let item = [];
        for (let i = 0; i < 3; i++) {
          for (let j = 0; j < 14; j++) {
            let cnt = randomNumber[mapValue + i * 14 + j];
            if (cnt < 9) {
              item.push(
                <Chair
                  key={"Chair : " + mapValue + i * 14 + j}
                  position={[y_list[j], 0.5, x_list[i]]}
                  rotation={[-Math.PI / 2, 0, p_list[j % 2]]}
                />
              );
            }
          }
        }
        return item;
      })()}

      {/* 첫번째줄  */}
      <Table_2 position={[-30, 0.5, -40]} rotation={[-Math.PI / 2, 0, 0]} />
      <Table_2 position={[-34, 0.5, -40]} rotation={[-Math.PI / 2, 0, 0]} />
      <Table_2 position={[-38, 0.5, -40]} rotation={[-Math.PI / 2, 0, 0]} />
      <Table_2 position={[-42, 0.5, -40]} rotation={[-Math.PI / 2, 0, 0]} />
      <Table_2 position={[-46, 0.5, -40]} rotation={[-Math.PI / 2, 0, 0]} />
      <Table_2 position={[-50, 0.5, -40]} rotation={[-Math.PI / 2, 0, 0]} />
      <Table_2 position={[-54, 0.5, -40]} rotation={[-Math.PI / 2, 0, 0]} />

      {/* 두번째줄  */}
      <Table_2 position={[-30, 0.5, -45]} rotation={[-Math.PI / 2, 0, 0]} />
      <Table_2 position={[-34, 0.5, -45]} rotation={[-Math.PI / 2, 0, 0]} />
      <Table_2 position={[-38, 0.5, -45]} rotation={[-Math.PI / 2, 0, 0]} />
      <Table_2 position={[-42, 0.5, -45]} rotation={[-Math.PI / 2, 0, 0]} />
      <Table_2 position={[-46, 0.5, -45]} rotation={[-Math.PI / 2, 0, 0]} />
      <Table_2 position={[-50, 0.5, -45]} rotation={[-Math.PI / 2, 0, 0]} />
      <Table_2 position={[-54, 0.5, -45]} rotation={[-Math.PI / 2, 0, 0]} />

      {/* 세번째줄  */}
      <Table_2 position={[-30, 0.5, -50]} rotation={[-Math.PI / 2, 0, 0]} />
      <Table_2 position={[-34, 0.5, -50]} rotation={[-Math.PI / 2, 0, 0]} />
      <Table_2 position={[-38, 0.5, -50]} rotation={[-Math.PI / 2, 0, 0]} />
      <Table_2 position={[-42, 0.5, -50]} rotation={[-Math.PI / 2, 0, 0]} />
      <Table_2 position={[-46, 0.5, -50]} rotation={[-Math.PI / 2, 0, 0]} />
      <Table_2 position={[-50, 0.5, -50]} rotation={[-Math.PI / 2, 0, 0]} />
      <Table_2 position={[-54, 0.5, -50]} rotation={[-Math.PI / 2, 0, 0]} />

      {/* 하트 정원 부분 */}

      {/* 00째 세로 */}
      <Bush_1
        position={[-24, 0.5, -56]}
        rotation={[-Math.PI / 2, 0, Math.PI]}
      />
      <Bush_2
        position={[-26, 0.5, -56]}
        rotation={[-Math.PI / 2, 0, Math.PI]}
      />
      <Bush_1
        position={[-30, 0.5, -56]}
        rotation={[-Math.PI / 2, 0, Math.PI]}
      />
      <Bush_2
        position={[-34, 0.5, -56]}
        rotation={[-Math.PI / 2, 0, Math.PI]}
      />
      <Bush_1
        position={[-38, 0.5, -56]}
        rotation={[-Math.PI / 2, 0, Math.PI]}
      />
      <Bush_2
        position={[-42, 0.5, -56]}
        rotation={[-Math.PI / 2, 0, Math.PI]}
      />
      <Bush_1
        position={[-46, 0.5, -56]}
        rotation={[-Math.PI / 2, 0, Math.PI]}
      />
      <Bush_2
        position={[-50, 0.5, -56]}
        rotation={[-Math.PI / 2, 0, Math.PI]}
      />
      <Bush_1
        position={[-54, 0.5, -56]}
        rotation={[-Math.PI / 2, 0, Math.PI]}
      />
      <Bush_2
        position={[-58, 0.5, -56]}
        rotation={[-Math.PI / 2, 0, Math.PI]}
      />
      {/* 0째 세로 */}
      <Bush_2
        position={[-24, 0.5, -58]}
        rotation={[-Math.PI / 2, 0, Math.PI]}
      />
      <Bush_1
        position={[-26, 0.5, -58]}
        rotation={[-Math.PI / 2, 0, Math.PI]}
      />
      <Bush_2
        position={[-30, 0.5, -58]}
        rotation={[-Math.PI / 2, 0, Math.PI]}
      />
      <Bush_1
        position={[-34, 0.5, -58]}
        rotation={[-Math.PI / 2, 0, Math.PI]}
      />
      <Bush_2
        position={[-38, 0.5, -58]}
        rotation={[-Math.PI / 2, 0, Math.PI]}
      />
      <Bush_1
        position={[-42, 0.5, -58]}
        rotation={[-Math.PI / 2, 0, Math.PI]}
      />
      <Bush_2
        position={[-46, 0.5, -58]}
        rotation={[-Math.PI / 2, 0, Math.PI]}
      />
      <Bush_1
        position={[-50, 0.5, -58]}
        rotation={[-Math.PI / 2, 0, Math.PI]}
      />
      <Bush_2
        position={[-54, 0.5, -58]}
        rotation={[-Math.PI / 2, 0, Math.PI]}
      />
      <Bush_1
        position={[-58, 0.5, -58]}
        rotation={[-Math.PI / 2, 0, Math.PI]}
      />
      {/* 1째 세로 */}
      <Bush_1
        position={[-24, 0.5, -60]}
        rotation={[-Math.PI / 2, 0, Math.PI]}
      />
      <Bush_2
        position={[-26, 0.5, -60]}
        rotation={[-Math.PI / 2, 0, Math.PI]}
      />
      <Bush_1
        position={[-30, 0.5, -60]}
        rotation={[-Math.PI / 2, 0, Math.PI]}
      />
      {/* <Bush_2
        position={[-34, 0.5, -60]}
        rotation={[-Math.PI / 2, 0, Math.PI]}
      />
      <Bush_1
        position={[-38, 0.5, -60]}
        rotation={[-Math.PI / 2, 0, Math.PI]}
      /> */}
      <Bush_2
        position={[-42, 0.5, -60]}
        rotation={[-Math.PI / 2, 0, Math.PI]}
      />
      <Bush_1
        position={[-46, 0.5, -60]}
        rotation={[-Math.PI / 2, 0, Math.PI]}
      />

      <Bush_2
        position={[-50, 0.5, -60]}
        rotation={[-Math.PI / 2, 0, Math.PI]}
      />
      <Bush_1
        position={[-54, 0.5, -60]}
        rotation={[-Math.PI / 2, 0, Math.PI]}
      />
      <Bush_2
        position={[-58, 0.5, -60]}
        rotation={[-Math.PI / 2, 0, Math.PI]}
      />
      {/* 2째 세로 */}
      <Bush_2
        position={[-24, 0.5, -62]}
        rotation={[-Math.PI / 2, 0, Math.PI]}
      />
      <Bush_1
        position={[-26, 0.5, -62]}
        rotation={[-Math.PI / 2, 0, Math.PI]}
      />
      {/* <Bush_2
        position={[-30, 0.5, -62]}
        rotation={[-Math.PI / 2, 0, Math.PI]}
      />
      <Bush_1
        position={[-34, 0.5, -62]}
        rotation={[-Math.PI / 2, 0, Math.PI]}
      />

      <Bush_2
        position={[-38, 0.5, -62]}
        rotation={[-Math.PI / 2, 0, Math.PI]}
      />
      <Bush_1
        position={[-42, 0.5, -62]}
        rotation={[-Math.PI / 2, 0, Math.PI]}
      /> */}

      <Bush_2
        position={[-46, 0.5, -62]}
        rotation={[-Math.PI / 2, 0, Math.PI]}
      />
      <Bush_1
        position={[-50, 0.5, -62]}
        rotation={[-Math.PI / 2, 0, Math.PI]}
      />

      <Bush_2
        position={[-54, 0.5, -62]}
        rotation={[-Math.PI / 2, 0, Math.PI]}
      />
      <Bush_1
        position={[-58, 0.5, -62]}
        rotation={[-Math.PI / 2, 0, Math.PI]}
      />
      {/* 3째 세로 */}
      <Bush_1
        position={[-24, 0.5, -64]}
        rotation={[-Math.PI / 2, 0, Math.PI]}
      />
      <Bush_2
        position={[-26, 0.5, -64]}
        rotation={[-Math.PI / 2, 0, Math.PI]}
      />
      {/* <Bush_1
        position={[-30, 0.5, -64]}
        rotation={[-Math.PI / 2, 0, Math.PI]}
      />
      <Bush_2
        position={[-34, 0.5, -64]}
        rotation={[-Math.PI / 2, 0, Math.PI]}
      />
      <Bush_1
        position={[-38, 0.5, -64]}
        rotation={[-Math.PI / 2, 0, Math.PI]}
      />
      <Bush_2
        position={[-42, 0.5, -64]}
        rotation={[-Math.PI / 2, 0, Math.PI]}
      />
      <Bush_1
        position={[-46, 0.5, -64]}
        rotation={[-Math.PI / 2, 0, Math.PI]}
      /> */}

      <Bush_2
        position={[-50, 0.5, -64]}
        rotation={[-Math.PI / 2, 0, Math.PI]}
      />
      <Bush_1
        position={[-54, 0.5, -64]}
        rotation={[-Math.PI / 2, 0, Math.PI]}
      />
      <Bush_2
        position={[-58, 0.5, -64]}
        rotation={[-Math.PI / 2, 0, Math.PI]}
      />
      {/* 4째 세로 */}
      <Bush_2
        position={[-24, 0.5, -66]}
        rotation={[-Math.PI / 2, 0, Math.PI]}
      />
      <Bush_1
        position={[-26, 0.5, -66]}
        rotation={[-Math.PI / 2, 0, Math.PI]}
      />
      <Bush_2
        position={[-30, 0.5, -66]}
        rotation={[-Math.PI / 2, 0, Math.PI]}
      />
      {/* <Bush_1
        position={[-34, 0.5, -66]}
        rotation={[-Math.PI / 2, 0, Math.PI]}
      />

      <Bush_2
        position={[-38, 0.5, -66]}
        rotation={[-Math.PI / 2, 0, Math.PI]}
      />
      <Bush_1
        position={[-42, 0.5, -66]}
        rotation={[-Math.PI / 2, 0, Math.PI]}
      />

      <Bush_2
        position={[-46, 0.5, -66]}
        rotation={[-Math.PI / 2, 0, Math.PI]}
      />
      <Bush_1
        position={[-50, 0.5, -66]}
        rotation={[-Math.PI / 2, 0, Math.PI]}
      /> */}
      <Bush_2
        position={[-54, 0.5, -66]}
        rotation={[-Math.PI / 2, 0, Math.PI]}
      />
      <Bush_1
        position={[-58, 0.5, -66]}
        rotation={[-Math.PI / 2, 0, Math.PI]}
      />
      {/* 5째 세로 */}
      <Bush_1
        position={[-24, 0.5, -68]}
        rotation={[-Math.PI / 2, 0, Math.PI]}
      />
      <Bush_2
        position={[-26, 0.5, -68]}
        rotation={[-Math.PI / 2, 0, Math.PI]}
      />
      {/* <Bush_1
        position={[-30, 0.5, -68]}
        rotation={[-Math.PI / 2, 0, Math.PI]}
      />
      <Bush_2
        position={[-34, 0.5, -68]}
        rotation={[-Math.PI / 2, 0, Math.PI]}
      />
      <Bush_1
        position={[-38, 0.5, -68]}
        rotation={[-Math.PI / 2, 0, Math.PI]}
      />
      <Bush_2
        position={[-42, 0.5, -68]}
        rotation={[-Math.PI / 2, 0, Math.PI]}
      />
      <Bush_1
        position={[-46, 0.5, -68]}
        rotation={[-Math.PI / 2, 0, Math.PI]}
      /> */}

      <Bush_2
        position={[-50, 0.5, -68]}
        rotation={[-Math.PI / 2, 0, Math.PI]}
      />
      <Bush_1
        position={[-54, 0.5, -68]}
        rotation={[-Math.PI / 2, 0, Math.PI]}
      />
      <Bush_2
        position={[-58, 0.5, -68]}
        rotation={[-Math.PI / 2, 0, Math.PI]}
      />
      {/* 6째 세로 */}
      <Bush_2
        position={[-24, 0.5, -70]}
        rotation={[-Math.PI / 2, 0, Math.PI]}
      />
      <Bush_1
        position={[-26, 0.5, -70]}
        rotation={[-Math.PI / 2, 0, Math.PI]}
      />
      {/* <Bush_2
        position={[-30, 0.5, -70]}
        rotation={[-Math.PI / 2, 0, Math.PI]}
      />
      <Bush_1
        position={[-34, 0.5, -70]}
        rotation={[-Math.PI / 2, 0, Math.PI]}
      />

      <Bush_2
        position={[-38, 0.5, -70]}
        rotation={[-Math.PI / 2, 0, Math.PI]}
      />
      <Bush_1
        position={[-42, 0.5, -70]}
        rotation={[-Math.PI / 2, 0, Math.PI]}
      /> */}

      <Bush_2
        position={[-46, 0.5, -70]}
        rotation={[-Math.PI / 2, 0, Math.PI]}
      />
      <Bush_1
        position={[-50, 0.5, -70]}
        rotation={[-Math.PI / 2, 0, Math.PI]}
      />
      <Bush_2
        position={[-54, 0.5, -70]}
        rotation={[-Math.PI / 2, 0, Math.PI]}
      />
      <Bush_1
        position={[-58, 0.5, -70]}
        rotation={[-Math.PI / 2, 0, Math.PI]}
      />
      {/* 7째 세로 */}
      <Bush_1
        position={[-24, 0.5, -72]}
        rotation={[-Math.PI / 2, 0, Math.PI]}
      />
      <Bush_2
        position={[-26, 0.5, -72]}
        rotation={[-Math.PI / 2, 0, Math.PI]}
      />
      <Bush_1
        position={[-30, 0.5, -72]}
        rotation={[-Math.PI / 2, 0, Math.PI]}
      />
      {/* <Bush_2
        position={[-34, 0.5, -72]}
        rotation={[-Math.PI / 2, 0, Math.PI]}
      />
      <Bush_1
        position={[-38, 0.5, -72]}
        rotation={[-Math.PI / 2, 0, Math.PI]}
      /> */}
      <Bush_2
        position={[-42, 0.5, -72]}
        rotation={[-Math.PI / 2, 0, Math.PI]}
      />
      <Bush_1
        position={[-46, 0.5, -72]}
        rotation={[-Math.PI / 2, 0, Math.PI]}
      />

      <Bush_2
        position={[-50, 0.5, -72]}
        rotation={[-Math.PI / 2, 0, Math.PI]}
      />
      <Bush_1
        position={[-54, 0.5, -72]}
        rotation={[-Math.PI / 2, 0, Math.PI]}
      />
      <Bush_2
        position={[-58, 0.5, -72]}
        rotation={[-Math.PI / 2, 0, Math.PI]}
      />
      {/* 8째 세로 */}
      <Bush_2
        position={[-24, 0.5, -74]}
        rotation={[-Math.PI / 2, 0, Math.PI]}
      />
      <Bush_1
        position={[-26, 0.5, -74]}
        rotation={[-Math.PI / 2, 0, Math.PI]}
      />
      <Bush_2
        position={[-30, 0.5, -74]}
        rotation={[-Math.PI / 2, 0, Math.PI]}
      />
      <Bush_1
        position={[-34, 0.5, -74]}
        rotation={[-Math.PI / 2, 0, Math.PI]}
      />
      <Bush_2
        position={[-38, 0.5, -74]}
        rotation={[-Math.PI / 2, 0, Math.PI]}
      />
      <Bush_1
        position={[-42, 0.5, -74]}
        rotation={[-Math.PI / 2, 0, Math.PI]}
      />
      <Bush_2
        position={[-46, 0.5, -74]}
        rotation={[-Math.PI / 2, 0, Math.PI]}
      />
      <Bush_1
        position={[-50, 0.5, -74]}
        rotation={[-Math.PI / 2, 0, Math.PI]}
      />
      <Bush_2
        position={[-54, 0.5, -74]}
        rotation={[-Math.PI / 2, 0, Math.PI]}
      />
      <Bush_1
        position={[-58, 0.5, -74]}
        rotation={[-Math.PI / 2, 0, Math.PI]}
      />

      {/* 9째 세로 */}
      <Bush_1
        position={[-24, 0.5, -76]}
        rotation={[-Math.PI / 2, 0, Math.PI]}
      />
      <Bush_2
        position={[-26, 0.5, -76]}
        rotation={[-Math.PI / 2, 0, Math.PI]}
      />
      <Bush_1
        position={[-30, 0.5, -76]}
        rotation={[-Math.PI / 2, 0, Math.PI]}
      />
      <Bush_2
        position={[-34, 0.5, -76]}
        rotation={[-Math.PI / 2, 0, Math.PI]}
      />
      <Bush_1
        position={[-38, 0.5, -76]}
        rotation={[-Math.PI / 2, 0, Math.PI]}
      />
      <Bush_2
        position={[-42, 0.5, -76]}
        rotation={[-Math.PI / 2, 0, Math.PI]}
      />
      <Bush_1
        position={[-46, 0.5, -76]}
        rotation={[-Math.PI / 2, 0, Math.PI]}
      />
      <Bush_2
        position={[-50, 0.5, -76]}
        rotation={[-Math.PI / 2, 0, Math.PI]}
      />
      <Bush_1
        position={[-54, 0.5, -76]}
        rotation={[-Math.PI / 2, 0, Math.PI]}
      />
      <Bush_2
        position={[-58, 0.5, -76]}
        rotation={[-Math.PI / 2, 0, Math.PI]}
      />

      {/* --------------------------------<4사분면 x>0, y<0 : 숲 속>-------------------------------------- */}

      <House_6
        position={[-25, 0.5, 30]}
        rotation={[-Math.PI / 2, 0, Math.PI / 2]}
      />
      <Dog_house
        position={[-25, 0.5, 20]}
        rotation={[-Math.PI / 2, 0, Math.PI / 2]}
      />
      <Fence
        position={[-16, 0.5, 15]}
        rotation={[-Math.PI / 2, 0, Math.PI / 2]}
      />
      <Fence
        position={[-25, 0.5, 15]}
        rotation={[-Math.PI / 2, 0, Math.PI / 2]}
      />
      <Fence
        position={[-34, 0.5, 15]}
        rotation={[-Math.PI / 2, 0, Math.PI / 2]}
      />
      <Fence
        position={[-39, 0.5, 20]}
        rotation={[-Math.PI / 2, 0, Math.PI / 1]}
      />
      <Fence
        position={[-39, 0.5, 29]}
        rotation={[-Math.PI / 2, 0, Math.PI / 1]}
      />
      <Fence
        position={[-39, 0.5, 38]}
        rotation={[-Math.PI / 2, 0, Math.PI / 1]}
      />
      <Fence
        position={[-34, 0.5, 42]}
        rotation={[-Math.PI / 2, 0, Math.PI / 2]}
      />
      <Fence
        position={[-25, 0.5, 42]}
        rotation={[-Math.PI / 2, 0, Math.PI / 2]}
      />
      <Fence
        position={[-16, 0.5, 42]}
        rotation={[-Math.PI / 2, 0, Math.PI / 2]}
      />
      <Fence
        position={[-11, 0.5, 19]}
        rotation={[-Math.PI / 2, 0, Math.PI / 1]}
      />
      <Fence
        position={[-11, 0.5, 28]}
        rotation={[-Math.PI / 2, 0, Math.PI / 1]}
      />
      <Fence
        position={[-11, 0.5, 37]}
        rotation={[-Math.PI / 2, 0, Math.PI / 1]}
      />

      {/* 잡초밭 */}
      {(() => {
        let item = [];
        for (let i = 0; i < 21; i++) {
          for (let j = 0; j < 21; j++) {
            let cnt = randomNumber[mapValue + i * 21 + j];
            if (cnt < 8) {
              item.push(
                <Grass
                  key={`Grass : `+mapValue + i * 21 + j}
                  position={[-15 - i, 0.5, 70 - j]}
                  rotation={[-Math.PI / 2, 0, Math.PI / 1]}
                />
              );
            }
          }
        }
        return item;
      })()}

      {/* 숲 */}
      {(() => {
        let item = [];
        for (let i = 0; i < 7; i++) {
          for (let j = 0; j < 12; j++) {
            let cnt = randomNumber[mapValue + i * 12 + j];
            if (cnt < 1) {
              item.push(
                <Tree_4
                  key={"Tree_4 : " + mapValue + i * 12 + j}
                  position={[-45 - i * 5, 0.5, 70 - j * 5]}
                  rotation={[-Math.PI / 2, 0, Math.PI / 1]}
                />
              );
            } else if (cnt < 2) {
              item.push(
                <Tree_9
                  key={"Tree_9 : " + mapValue + i * 12 + j}
                  position={[-45 - i * 5, 0.5, 70 - j * 5]}
                  rotation={[-Math.PI / 2, 0, Math.PI / 1]}
                />
              );
            } else if (cnt < 3) {
              item.push(
                <Tree_2
                  key={"Tree_2 : " + mapValue + i * 12 + j}
                  position={[-45 - i * 5, 0.5, 70 - j * 5]}
                  rotation={[-Math.PI / 2, 0, Math.PI / 1]}
                />
              );
            } else if (cnt < 4) {
              item.push(
                <Tree_4
                  key={"Tree_4 : " + mapValue + i * 12 + j}
                  position={[-45 - i * 5, 0.5, 70 - j * 5]}
                  rotation={[-Math.PI / 2, 0, Math.PI / 1]}
                />
              );
            }
          }
        }
        return item;
      })()}

      {Array.from({ length: 6 }, (_, i) => -15 - i * 4).map((x) => (
        <Bush
          key={"Bush :" + x}
          position={[x, 0.5, 75]}
          rotation={[-Math.PI / 2, 0, Math.PI / 1]}
        />
      ))}

      <Hay_1
        position={[-40, 0.5, 65]}
        rotation={[-Math.PI / 2, 0, Math.PI / 1]}
      />
      <Hay_2
        position={[-40, 0.5, 55]}
        rotation={[-Math.PI / 2, 0, Math.PI / 1]}
      />
      <Hay_2
        position={[-40, 0.5, 53]}
        rotation={[-Math.PI / 2, 0, Math.PI / 1]}
      />

      <Tree_house_trunk
        position={[-65, 0.5, 65]}
        rotation={[-Math.PI / 2, 0, Math.PI / 2]}
      />

      <Axe
        position={[-50, 0.5, 10]}
        rotation={[-Math.PI / 2, 0, Math.PI / 1]}
      />
      <Axe
        position={[-35, 0.5, 45]}
        rotation={[-Math.PI / 2, 0, Math.PI / 1]}
      />
      <Barrel
        position={[-25, 1.9, 45]}
        rotation={[-Math.PI / 2, 0, Math.PI / 1]}
      />
      <Barrel
        position={[-30, 1.9, 10]}
        rotation={[-Math.PI / 2, 0, Math.PI / 1]}
      />
      <Logs
        position={[-65, 0.5, 10]}
        rotation={[-Math.PI / 2, 0, Math.PI / 1]}
      />
      <Logs
        position={[-55, 0.5, 75]}
        rotation={[-Math.PI / 2, 0, Math.PI / 1]}
      />
      <Bench_2
        position={[-10, 0.5, 50]}
        rotation={[-Math.PI / 2, 0, Math.PI / 0.5]}
      />
      <Bench_2
        position={[-10, 0.5, 55]}
        rotation={[-Math.PI / 2, 0, Math.PI / 0.5]}
      />
      <Bench_2
        position={[-10, 0.5, 60]}
        rotation={[-Math.PI / 2, 0, Math.PI / 0.5]}
      />
      <Bench_2
        position={[-10, 0.5, 65]}
        rotation={[-Math.PI / 2, 0, Math.PI / 0.5]}
      />
    </>
  );
}
