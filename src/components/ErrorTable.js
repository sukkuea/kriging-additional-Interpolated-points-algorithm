import React from "react";
const ErrorTable = ({ error, semiVarioGram, variable }) => {
  const isHaveNuggetSillRange = Object.keys(variable).length > 0;
  const isHaveCalculateConstant = isHaveNuggetSillRange
    ? true
    : semiVarioGram && semiVarioGram.exponentialWithConstant;

  return (
    <div>
      <table id="error-table">
        <thead>
          <tr>
            <th>Model</th>
            <th>Mean Error</th>
            <th>Mean of Percentage Error</th>
            <th>Mean Absolute Error</th>
            <th>Mean Squre Error</th>
            <th>Root Mean Squre Error</th>
          </tr>
        </thead>
        <tbody style={{ textAlign: "center" }}>
          <tr>
            <td>Guassian Model</td>
            <td>{error["gaussian"].meanError}</td>
            <td>{error["gaussian"].meanOfPercentageError}</td>
            <td>{error["gaussian"].meanAbsoluteError}</td>
            <td>{error["gaussian"].meanSquareError}</td>
            <td>{error["gaussian"].rootMeanSquareError}</td>
          </tr>
          <tr>
            <td>Spherical Model</td>
            <td>{error["sherical"].meanError}</td>
            <td>{error["sherical"].meanOfPercentageError}</td>
            <td>{error["sherical"].meanAbsoluteError}</td>
            <td>{error["sherical"].meanSquareError}</td>
            <td>{error["sherical"].rootMeanSquareError}</td>
          </tr>
          {isHaveCalculateConstant && (
            <tr>
              <td>Exponential Model</td>
              <td>{error["exponentialWithConstant"].meanError}</td>
              <td>{error["exponentialWithConstant"].meanOfPercentageError}</td>
              <td>{error["exponentialWithConstant"].meanAbsoluteError}</td>
              <td>{error["exponentialWithConstant"].meanSquareError}</td>
              <td>{error["exponentialWithConstant"].rootMeanSquareError}</td>
            </tr>
          )}
          <tr>
            <td>Exponential(EPO)</td>
            <td>{error["exponential"].meanError}</td>
            <td>{error["exponential"].meanOfPercentageError}</td>
            <td>{error["exponential"].meanAbsoluteError}</td>
            <td>{error["exponential"].meanSquareError}</td>
            <td>{error["exponential"].rootMeanSquareError}</td>
          </tr>
          {/* trendline */}
          <tr>
            <td>Exponential(ETL)</td>
            <td>{error["exponential"].meanError}</td>
            <td>{error["exponential"].meanOfPercentageError}</td>
            <td>{error["exponential"].meanAbsoluteError}</td>
            <td>{error["exponential"].meanSquareError}</td>
            <td>{error["exponential"].rootMeanSquareError}</td>
          </tr>
          <tr>
            <td>Exponential(EKO)</td>
            <td>{error["exponentialWithKIteration"].meanError}</td>
            <td>{error["exponentialWithKIteration"].meanOfPercentageError}</td>
            <td>{error["exponentialWithKIteration"].meanAbsoluteError}</td>
            <td>{error["exponentialWithKIteration"].meanSquareError}</td>
            <td>{error["exponentialWithKIteration"].rootMeanSquareError}</td>
          </tr>

        </tbody>
      </table>
    </div>
  );
};
export default ErrorTable;
