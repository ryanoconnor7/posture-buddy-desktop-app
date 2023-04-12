import {NormalizedLandmarkList} from '@mediapipe/pose';

export {addData, startTime, toggleControl, CSVdata}

let CSVdata: postureInstance [] = [];
let start = Date.now();
let isControl: boolean = true;

interface postureInstance { Control?:boolean, Reason?: string, Time?: number,
  ZeroX?: number, ZeroY?: number, ZeroZ?: number, ZeroVis?: number
  OneX?: number, OneY?: number, OneZ?: number, OneVis?: number,
  TwoX?: number, TwoY?: number, TwoZ?: number, TwoVis?: number,
  ThreeX?: number, ThreeY?: number, ThreeZ?: number, ThreeVis?: number,
  FourX?: number, FourY?: number, FourZ?: number, FourVis?: number,
  FiveX?: number, FiveY?: number, FiveZ?: number, FiveVis?: number,
  SixX?: number, SixY?: number, SixZ?: number, SixVis?: number,
  SevenX?: number, SevenY?: number, SevenZ?: number, SevenVis?: number,
  EightX?: number, EightY?: number, EightZ?: number, EightVis?: number,
  NineX?: number, NineY?: number, NineZ?: number, NineVis?: number,
  TenX?: number, TenY?: number, TenZ?: number, TenVis?: number,
  ElevenX?: number, ElevenY?: number, ElevenZ?: number, ElevenVis?: number,
  TwelveX?: number, TwelveY?: number, TwelveZ?: number, TwelveVis?: number,
  ThirteenX?: number, ThirteenY?: number, ThirteenZ?: number, ThirteenVis?: number,
  FourteenX?: number, FourteenY?: number, FourteenZ?: number, FourteenVis?: number,
  FifteenX?: number, FifteenY?: number, FifteenZ?: number, FifteenVis?: number,
  SixteenX?: number, SixteenY?: number, SixteenZ?: number, SixteenVis?: number,
  // SeventeenX?: number, SeventeenY?: number, SeventeenZ?: number, SeventeenVis?: number,
  // EightteenX?: number, EightteenY?: number, EightteenZ?: number, EightteenVis?: number,
  // NineteenX?: number, NineteenY?: number, NineteenZ?: number, NineteenVis?: number,
  // TwentyX?: number, TwentyY?: number, TwentyZ?: number, TwentyVis?: number,
  // TwentyOneX?: number, TwentyOneY?: number, TwentyOneZ?: number, TwentyOneVis?: number,
  // TwentyTwoX?: number, TwentyTwoY?: number, TwentyTwoZ?: number, TwentyTwoVis?: number,
  TwentyThreeX?: number, TwentyThreeY?: number, TwentyThreeZ?: number, TwentyThreeVis?: number,
  TwentyFourX?: number, TwentyFourY?: number, TwentyFourZ?: number, TwentyFourVis?: number,
  }

  const startTime = function() {
    start = Date.now();
  }


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

const toggleControl = function(){
  if(isControl){
    isControl = false;
  } else {
    isControl = true;
  }
}

const addData = function (reason:string, pose:NormalizedLandmarkList) {
  let line: postureInstance = {
    Control: isControl, Reason: reason, Time: (Date.now() - start),
    ZeroX: pose[0].x, ZeroY: pose[0].y, ZeroZ: pose[0].z, ZeroVis: pose[0].visibility,
    OneX: pose[1].x, OneY: pose[1].y, OneZ: pose[1].z, OneVis: pose[1].visibility,
    TwoX: pose[2].x, TwoY: pose[2].y, TwoZ: pose[2].z, TwoVis: pose[2].visibility,
    ThreeX: pose[3].x, ThreeY: pose[3].y, ThreeZ: pose[3].z, ThreeVis: pose[3].visibility,
    FourX: pose[4].x, FourY: pose[4].y, FourZ: pose[4].z, FourVis: pose[4].visibility,
    FiveX: pose[5].x, FiveY: pose[5].y, FiveZ: pose[5].z, FiveVis: pose[5].visibility,
    SixX: pose[6].x, SixY: pose[6].y, SixZ: pose[6].z, SixVis: pose[6].visibility,
    SevenX: pose[7].x, SevenY: pose[7].y, SevenZ: pose[7].z, SevenVis: pose[7].visibility,
    EightX: pose[8].x, EightY: pose[8].y, EightZ: pose[8].z, EightVis: pose[8].visibility,
    NineX: pose[9].x, NineY: pose[9].y, NineZ: pose[9].z, NineVis: pose[9].visibility,
    TenX: pose[10].x, TenY: pose[10].y, TenZ: pose[10].z, TenVis: pose[10].visibility,
    ElevenX: pose[11].x, ElevenY: pose[11].y, ElevenZ: pose[11].z, ElevenVis: pose[11].visibility,
    TwelveX: pose[12].x, TwelveY: pose[12].y, TwelveZ: pose[12].z, TwelveVis: pose[12].visibility,
    ThirteenX: pose[13].x, ThirteenY: pose[13].y, ThirteenZ: pose[13].z, ThirteenVis: pose[13].visibility,
    FourteenX: pose[14].x, FourteenY: pose[14].y, FourteenZ: pose[14].z, FourteenVis: pose[14].visibility,
    FifteenX: pose[15].x, FifteenY: pose[15].y, FifteenZ: pose[15].z, FifteenVis: pose[15].visibility,
    SixteenX: pose[16].x, SixteenY: pose[16].y, SixteenZ: pose[16].z, SixteenVis: pose[16].visibility,
    //SeventeenX: pose[].x, SeventeenY: pose[, SeventeenZ: pose[].z, SeventeenVis: pose[].visibility,
    //EightteenX: pose[].x, EightteenY: pose[, EightteenZ: pose[].z, EightteenVis: pose[].visibility,
    //NineteenX: pose[].x, NineteenY: pose[, NineteenZ: pose[].z, NineteenVis: pose[].visibility,
    //TwentyX: pose[].x, TwentyY: pose[, TwentyZ: pose[].z, TwentyVis: pose[].visibility,
    //TwentyOneX: pose[].x, TwentyOneY: pose[, TwentyOneZ: pose[].z, TwentyOneVis: pose[].visibility,
    //TwentyTwoX: pose[].x, TwentyTwoY: pose[, TwentyTwoZ: pose[].z, TwentyTwoVis: pose[].visibility,
    TwentyThreeX: pose[23].x, TwentyThreeY: pose[23].y, TwentyThreeZ: pose[23].z, TwentyThreeVis: pose[23].visibility,
    TwentyFourX: pose[24].x, TwentyFourY: pose[24].y, TwentyFourZ: pose[24].z, TwentyFourVis: pose[24].visibility,
  }
  if(line !== undefined){
    CSVdata.push(line);
  }
}


