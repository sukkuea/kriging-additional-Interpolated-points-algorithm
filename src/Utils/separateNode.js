import memoize from 'fast-memoize';
import { max, min, variance } from 'simple-statistics';
import computePredict, { transformSemiVarioGramWithSeparateNode } from './computePredict';
const memoizeTransformSemiVarioGramWithSeparateNode = memoize(transformSemiVarioGramWithSeparateNode)
export const findCenter = (nodes) => {
  let tempX = 0;
  let tempY = 0;

  for (let i = 0; i < nodes.length; i++) {
    const { latitude, longtitude } = nodes[i];
    tempX += latitude;
    tempY += longtitude;
  }

  return {
    meanX: tempX / nodes.length,
    meanY: tempY / nodes.length,
  };
};
export const randomGenerator = ({ xMax, xMin, yMax, yMin, idTemp, }) => {
  const latitude = Math.random() * (xMax - xMin + 1) + xMin
  const longtitude = Math.random() * (yMax - yMin + 1) + yMin

  return {
    isGenerate: true,
    longtitude,
    latitude,
    attitude: 0,
    id: idTemp
  }
}
export const getMinMaxLatAndLon = (zone) => {
  const zoneKeys = Object.keys(zone)

  const minAndMaxPerZone = zoneKeys.reduce((acc, next, index) => {
    const nodes = zone[next];
    const latArr = nodes.map((node) => node.latitude) //x [1,2,3] => max = 3 min =1
    const lonArr = nodes.map((node) => node.longtitude)//y
    const xMax = max(latArr) //[1,2,3] = 3
    const xMin = min(latArr)
    const yMax = max(lonArr)
    const yMin = min(lonArr)
    return {
      ...acc,
      [next]: {
        xMax,
        xMin,
        yMax,
        yMin,
      }
    }
  }, {})
  return minAndMaxPerZone
}

export const withGenerateZone = (n, nodeLength, zone, variable, model, { semiVarioGramHash, allNodeRangeHash, bestSumHash }) => memoizeCalCulateAttitude => {

  const lengthPerZone = Math.ceil(nodeLength / (n * n)) * 2;
  const zoneKeys = Object.keys(zone)
  const minAndMaxPerZone = getMinMaxLatAndLon(zone);

  let idTemp = nodeLength + 1;
  let semiVarioGramTemp = {
    exponential: [],
    exponentialWithConstant: [],
    exponentialWithKIteration: [],
    gaussian: [],
    linear: [],
    pentaspherical: [],
    spherical: [],
    trendline: [],
  };
  const allRangeOfNodesTemp = []
  const newNode = []
  for (let i = 0; i < zoneKeys.length; i++) {
    const selectedZone = zone[zoneKeys[i]]
    const generateZoneLength = lengthPerZone - selectedZone.length
    const { xMax, xMin, yMax, yMin, } = minAndMaxPerZone[i];
    for (let j = 0; j < generateZoneLength; j++) {
      selectedZone.push(randomGenerator({
        xMax, xMin, yMax, yMin, idTemp,
      }))
      const {
        bestSum,
        allRangeOfNodes,
        semiVarioGram
      } = memoizeCalCulateAttitude(selectedZone, variable)
      selectedZone[selectedZone.length - 1].attitude = bestSum[model]

      semiVarioGramHash[i] = semiVarioGram
      allNodeRangeHash[i] = allRangeOfNodes
      bestSumHash[idTemp] = bestSum
      idTemp++;
    }
  }
  for (let i = 0; i < zoneKeys.length; i++) {
    const selectedZone = zone[zoneKeys[i]]
    semiVarioGramTemp = memoizeTransformSemiVarioGramWithSeparateNode(
      semiVarioGramHash[i],
      semiVarioGramTemp
    );

    allRangeOfNodesTemp.push(...allNodeRangeHash[i])

    const trasnformNodesWithPredict = computePredict(
      selectedZone,
      bestSumHash
    );
    newNode.push(...trasnformNodesWithPredict);

  }

  return {
    allRangeOfNodesTemp,
    semiVarioGramTemp,
    newNode,
  }
}

export const separateZone = (nodes, center) => {
  const { meanX, meanY } = center;
  let zoneArray = { 0: [], 1: [], 2: [], 3: [] };

  for (let i = 0; i < nodes.length; i++) {
    const { latitude, longtitude } = nodes[i];
    const numberLatitude = Number(latitude);
    const numberLongtitude = Number(longtitude);
    if (numberLatitude <= meanX && numberLongtitude >= meanY) {
      zoneArray[0] = [...zoneArray[0], nodes[i]];
    }

    if (numberLatitude >= meanX && numberLongtitude >= meanY) {
      zoneArray[1] = [...zoneArray[1], nodes[i]];
    }

    if (numberLatitude <= meanX && numberLongtitude <= meanY) {
      zoneArray[2] = [...zoneArray[2], nodes[i]];
    }

    if (numberLatitude >= meanX && numberLongtitude <= meanY) {
      zoneArray[3] = [...zoneArray[3], nodes[i]];
    }
  }
  return {
    ...zoneArray,
  };
};

export const separateNineZone = (nodes) => {
  // [ {longtitude, lattitude, attitude}]
  let zone = { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [], 8: [] }
  const latArr = nodes.map((node) => node.latitude) //x [1,2,3] => max = 3 min =1
  const lonArr = nodes.map((node) => node.longtitude)//y

  const xMax = max(latArr) //[1,2,3] = 3
  const xMin = min(latArr)

  const yMax = max(lonArr)
  const yMin = min(lonArr)
  // If 1 if( xmin ถึง xmin + X/3 )and( ymin ถึง Y/3) ให้อยู่โซน 1
  for (let i = 0; i < nodes.length; i++) {
    const { latitude: x, longtitude: y } = nodes[i]
    const row = (yMax - yMin) / 3
    const column = (xMax - xMin) / 3

    if (x < xMin + column && y <= yMin + row) {
      // 1
      zone[0] = [
        ...zone[0],
        nodes[i]
      ]

    } else if (x >= xMin + column && x < xMin + 2 * column && y <= yMin + row) {
      // 2
      zone[1] = [
        ...zone[1],
        nodes[i]
      ]
    } else if (x >= xMin + 2 * column && x <= xMax && y <= yMin + row) {
      // 3

      zone[2] = [
        ...zone[2],
        nodes[i]
      ]
    } else if (x < xMin + column && y >= yMin + row && y <= yMin + 2 * row) {
      // 4

      zone[3] = [
        ...zone[3],
        nodes[i]
      ]
    } else if (x >= xMin + column && x < xMin + 2 * column && y >= yMin + row && y <= yMin + 2 * row) {
      // 5

      zone[4] = [
        ...zone[4],
        nodes[i]
      ]
    } else if (x >= xMin + 2 * column && x <= xMax && y >= yMin + row && y <= yMin + 2 * row) {
      // 6
      zone[5] = [
        ...zone[5],
        nodes[i]
      ]
    }
    else if (x < xMin + column && y >= yMin + 2 * row && y <= yMax) {
      // 7
      zone[6] = [
        ...zone[6],
        nodes[i]
      ]
    }
    else if (x >= xMin + column && x < xMin + 2 * column && y >= yMin + 2 * row && y <= yMax) {
      // 8
      zone[7] = [
        ...zone[7],
        nodes[i]
      ]

    } else {
      // 9

      zone[8] = [
        ...zone[8],
        nodes[i],
      ]
    }
  }

  return zone
}