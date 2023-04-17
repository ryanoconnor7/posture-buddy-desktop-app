import { NormalizedLandmarkList } from '@mediapipe/pose';
import { ExportToCsv } from 'export-to-csv';
import { InterventionMode } from './App';

export let CSVdata: postureInstance[] = [];
export let start = Date.now();
export let curMode: InterventionMode = 'off';

let lastPoseArray: NormalizedLandmarkList = [];

export const updateLastPoseArray = function (
  poseArray: NormalizedLandmarkList
) {
  lastPoseArray = poseArray;
};

export interface postureInstance {
  Control?: InterventionMode;
  Reason?: string;
  Time?: number;
  ZeroX?: number;
  ZeroY?: number;
  ZeroZ?: number;
  ZeroVis?: number;
  OneX?: number;
  OneY?: number;
  OneZ?: number;
  OneVis?: number;
  TwoX?: number;
  TwoY?: number;
  TwoZ?: number;
  TwoVis?: number;
  ThreeX?: number;
  ThreeY?: number;
  ThreeZ?: number;
  ThreeVis?: number;
  FourX?: number;
  FourY?: number;
  FourZ?: number;
  FourVis?: number;
  FiveX?: number;
  FiveY?: number;
  FiveZ?: number;
  FiveVis?: number;
  SixX?: number;
  SixY?: number;
  SixZ?: number;
  SixVis?: number;
  SevenX?: number;
  SevenY?: number;
  SevenZ?: number;
  SevenVis?: number;
  EightX?: number;
  EightY?: number;
  EightZ?: number;
  EightVis?: number;
  NineX?: number;
  NineY?: number;
  NineZ?: number;
  NineVis?: number;
  TenX?: number;
  TenY?: number;
  TenZ?: number;
  TenVis?: number;
  ElevenX?: number;
  ElevenY?: number;
  ElevenZ?: number;
  ElevenVis?: number;
  TwelveX?: number;
  TwelveY?: number;
  TwelveZ?: number;
  TwelveVis?: number;
  ThirteenX?: number;
  ThirteenY?: number;
  ThirteenZ?: number;
  ThirteenVis?: number;
  FourteenX?: number;
  FourteenY?: number;
  FourteenZ?: number;
  FourteenVis?: number;
  FifteenX?: number;
  FifteenY?: number;
  FifteenZ?: number;
  FifteenVis?: number;
  SixteenX?: number;
  SixteenY?: number;
  SixteenZ?: number;
  SixteenVis?: number;
  // SeventeenX?: number, SeventeenY?: number, SeventeenZ?: number, SeventeenVis?: number,
  // EightteenX?: number, EightteenY?: number, EightteenZ?: number, EightteenVis?: number,
  // NineteenX?: number, NineteenY?: number, NineteenZ?: number, NineteenVis?: number,
  // TwentyX?: number, TwentyY?: number, TwentyZ?: number, TwentyVis?: number,
  // TwentyOneX?: number, TwentyOneY?: number, TwentyOneZ?: number, TwentyOneVis?: number,
  // TwentyTwoX?: number, TwentyTwoY?: number, TwentyTwoZ?: number, TwentyTwoVis?: number,
  TwentyThreeX?: number;
  TwentyThreeY?: number;
  TwentyThreeZ?: number;
  TwentyThreeVis?: number;
  TwentyFourX?: number;
  TwentyFourY?: number;
  TwentyFourZ?: number;
  TwentyFourVis?: number;
  TranslateX?: number;
  TranslateY?: number;
  Scale?: number;
}

export const startTime = function () {
  start = Date.now();
};

// const makePostInstance = function (line:number[], reason:string) {
//   if(line.length < 100){
//     let result: postureInstance = {};
//     return result;
//   }
//   let formattedLine: postureInstance = {
//     Reason: reason, Time: (Date.now() - start),
//   ZeroX: line[0], ZeroY: line[1], ZeroZ: line[2], ZeroVis: line[3],
//   OneX: line[4], OneY: line[5], OneZ: line[6], OneVis: line[7],
//   TwoX: line[8], TwoY: line[9], TwoZ: line[10], TwoVis: line[11],
//   ThreeX: line[12], ThreeY: line[13], ThreeZ: line[14], ThreeVis: line[15],
//   FourX: line[16], FourY: line[17], FourZ: line[18], FourVis: line[19],
//   FiveX: line[20], FiveY: line[21], FiveZ: line[22], FiveVis: line[23],
//   SixX: line[24], SixY: line[25], SixZ: line[26], SixVis: line[27],
//   SevenX: line[28], SevenY: line[29], SevenZ: line[30], SevenVis: line[31],
//   EightX: line[32], EightY: line[33], EightZ: line[34], EightVis: line[35],
//   NineX: line[36], NineY: line[37], NineZ: line[38], NineVis: line[39],
//   TenX: line[40], TenY: line[41], TenZ: line[42], TenVis: line[43],
//   ElevenX: line[44], ElevenY: line[45], ElevenZ: line[46], ElevenVis: line[47],
//   TwelveX: line[48], TwelveY: line[49], TwelveZ: line[50], TwelveVis: line[51],
//   ThirteenX: line[52], ThirteenY: line[53], ThirteenZ: line[54], ThirteenVis: line[55],
//   FourteenX: line[56], FourteenY: line[57], FourteenZ: line[58], FourteenVis: line[59],
//   FifteenX: line[60], FifteenY: line[61], FifteenZ: line[62], FifteenVis: line[63],
//   SixteenX: line[64], SixteenY: line[65], SixteenZ: line[66], SixteenVis: line[67],
//   // SeventeenX: line[68], SeventeenY: line[69], SeventeenZ: line[70], SeventeenVis: line[71],
//   // EightteenX: line[72], EightteenY: line[73], EightteenZ: line[74], EightteenVis: line[75],
//   // NineteenX: line[76], NineteenY: line[77], NineteenZ: line[78], NineteenVis: line[79],
//   // TwentyX: line[80], TwentyY: line[81], TwentyZ: line[82], TwentyVis: line[83],
//   // TwentyOneX: line[84], TwentyOneY: line[85], TwentyOneZ: line[86], TwentyOneVis: line[87],
//   // TwentyTwoX: line[88], TwentyTwoY: line[89], TwentyTwoZ: line[90], TwentyTwoVis: line[91],
//   TwentyThreeX: line[92], TwentyThreeY: line[93], TwentyThreeZ: line[94], TwentyThreeVis: line[95],
//   TwentyFourX: line[96], TwentyFourY: line[97], TwentyFourZ: line[98], TwentyFourVis: line[99],
//   }
//   return formattedLine;
// }

export const toggleMode = function (mode: InterventionMode) {
  curMode = mode;
};

export const addData = function (
  reason: string,
  transform?: {
    TranslateX?: number;
    TranslateY?: number;
    Scale?: number;
  }
) {
  console.log(curMode);
  console.log(reason);
  let line: postureInstance = {
    Control: curMode,
    Reason: reason,
    Time: Date.now() - start,
    ZeroX: lastPoseArray[0].x,
    ZeroY: lastPoseArray[0].y,
    ZeroZ: lastPoseArray[0].z,
    ZeroVis: lastPoseArray[0].visibility,
    OneX: lastPoseArray[1].x,
    OneY: lastPoseArray[1].y,
    OneZ: lastPoseArray[1].z,
    OneVis: lastPoseArray[1].visibility,
    TwoX: lastPoseArray[2].x,
    TwoY: lastPoseArray[2].y,
    TwoZ: lastPoseArray[2].z,
    TwoVis: lastPoseArray[2].visibility,
    ThreeX: lastPoseArray[3].x,
    ThreeY: lastPoseArray[3].y,
    ThreeZ: lastPoseArray[3].z,
    ThreeVis: lastPoseArray[3].visibility,
    FourX: lastPoseArray[4].x,
    FourY: lastPoseArray[4].y,
    FourZ: lastPoseArray[4].z,
    FourVis: lastPoseArray[4].visibility,
    FiveX: lastPoseArray[5].x,
    FiveY: lastPoseArray[5].y,
    FiveZ: lastPoseArray[5].z,
    FiveVis: lastPoseArray[5].visibility,
    SixX: lastPoseArray[6].x,
    SixY: lastPoseArray[6].y,
    SixZ: lastPoseArray[6].z,
    SixVis: lastPoseArray[6].visibility,
    SevenX: lastPoseArray[7].x,
    SevenY: lastPoseArray[7].y,
    SevenZ: lastPoseArray[7].z,
    SevenVis: lastPoseArray[7].visibility,
    EightX: lastPoseArray[8].x,
    EightY: lastPoseArray[8].y,
    EightZ: lastPoseArray[8].z,
    EightVis: lastPoseArray[8].visibility,
    NineX: lastPoseArray[9].x,
    NineY: lastPoseArray[9].y,
    NineZ: lastPoseArray[9].z,
    NineVis: lastPoseArray[9].visibility,
    TenX: lastPoseArray[10].x,
    TenY: lastPoseArray[10].y,
    TenZ: lastPoseArray[10].z,
    TenVis: lastPoseArray[10].visibility,
    ElevenX: lastPoseArray[11].x,
    ElevenY: lastPoseArray[11].y,
    ElevenZ: lastPoseArray[11].z,
    ElevenVis: lastPoseArray[11].visibility,
    TwelveX: lastPoseArray[12].x,
    TwelveY: lastPoseArray[12].y,
    TwelveZ: lastPoseArray[12].z,
    TwelveVis: lastPoseArray[12].visibility,
    ThirteenX: lastPoseArray[13].x,
    ThirteenY: lastPoseArray[13].y,
    ThirteenZ: lastPoseArray[13].z,
    ThirteenVis: lastPoseArray[13].visibility,
    FourteenX: lastPoseArray[14].x,
    FourteenY: lastPoseArray[14].y,
    FourteenZ: lastPoseArray[14].z,
    FourteenVis: lastPoseArray[14].visibility,
    FifteenX: lastPoseArray[15].x,
    FifteenY: lastPoseArray[15].y,
    FifteenZ: lastPoseArray[15].z,
    FifteenVis: lastPoseArray[15].visibility,
    SixteenX: lastPoseArray[16].x,
    SixteenY: lastPoseArray[16].y,
    SixteenZ: lastPoseArray[16].z,
    SixteenVis: lastPoseArray[16].visibility,
    //SeventeenX: pose[].x, SeventeenY: pose[, SeventeenZ: pose[].z, SeventeenVis: pose[].visibility,
    //EightteenX: pose[].x, EightteenY: pose[, EightteenZ: pose[].z, EightteenVis: pose[].visibility,
    //NineteenX: pose[].x, NineteenY: pose[, NineteenZ: pose[].z, NineteenVis: pose[].visibility,
    //TwentyX: pose[].x, TwentyY: pose[, TwentyZ: pose[].z, TwentyVis: pose[].visibility,
    //TwentyOneX: pose[].x, TwentyOneY: pose[, TwentyOneZ: pose[].z, TwentyOneVis: pose[].visibility,
    //TwentyTwoX: pose[].x, TwentyTwoY: pose[, TwentyTwoZ: pose[].z, TwentyTwoVis: pose[].visibility,
    TwentyThreeX: lastPoseArray[23].x,
    TwentyThreeY: lastPoseArray[23].y,
    TwentyThreeZ: lastPoseArray[23].z,
    TwentyThreeVis: lastPoseArray[23].visibility,
    TwentyFourX: lastPoseArray[24].x,
    TwentyFourY: lastPoseArray[24].y,
    TwentyFourZ: lastPoseArray[24].z,
    TwentyFourVis: lastPoseArray[24].visibility,
    TranslateX: transform?.TranslateX ?? 0,
    TranslateY: transform?.TranslateY ?? 0,
    Scale: transform?.Scale ?? 0,
  };
  if (line !== undefined) {
    CSVdata.push(line);
  }
};

const options = {
  fieldSeparator: ',',
  quoteStrings: '"',
  decimalSeparator: '.',
  showLabels: true,
  showTitle: false,
  title: 'Test Data',
  useTextFile: false,
  useBom: true,
  useKeysAsHeaders: true,
  // headers: ['Column 1', 'Column 2', etc...] <-- Won't work with useKeysAsHeaders present!
};

export const csvReady = function () {
  const csvExporter = new ExportToCsv(options);
  csvExporter.generateCsv(CSVdata);
};
