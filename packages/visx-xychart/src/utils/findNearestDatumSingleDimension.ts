import { AxisScale } from '@visx/axis';
import { ScaleInput } from '@visx/scale';
import { bisector, range as d3Range, bisectLeft } from 'd3-array';

// @TODO make more robust to null/undefined scaled values
export default function findNearestDatumSingleDimension<
  Scale extends AxisScale,
  Datum extends object
>({
  scale,
  accessor,
  svgCoord,
  data,
}: {
  scale: Scale;
  accessor: (d: Datum) => ScaleInput<Scale>;
  svgCoord: number;
  data: Datum[];
}) {
  const coercedScale = scale as AxisScale;

  let nearestDatum: Datum;
  let nearestDatumIndex: number;
  // if scale has .invert(), convert svg coord to nearest data value
  if ('invert' in coercedScale && typeof coercedScale.invert === 'function') {
    const bisect = bisector(accessor).left;
    // find closest data value, then map that to closest datum
    const dataValue = Number(coercedScale.invert(svgCoord));
    const index = bisect(data, dataValue);
    // take the two datum nearest this index, and compute which is closer
    const nearestDatum0 = data[index - 1];
    const nearestDatum1 = data[index];
    nearestDatum =
      !nearestDatum0 ||
      Math.abs(dataValue - accessor(nearestDatum0)) > Math.abs(dataValue - accessor(nearestDatum1))
        ? nearestDatum1
        : nearestDatum0;
    nearestDatumIndex = nearestDatum === nearestDatum0 ? index - 1 : index;
  } else if ('step' in coercedScale && typeof coercedScale.step !== 'undefined') {
    // Ordinal scales don't have an invert function but they do have discrete domains
    // so we manually invert
    const domain = scale.domain();
    const range = scale.range().map(Number);
    const sortedRange = [...range].sort(); // bisectLeft assumes sort
    const rangePoints = d3Range(sortedRange[0], sortedRange[1], coercedScale.step());
    const domainIndex = bisectLeft(rangePoints, svgCoord);
    // y-axis scales may have reverse ranges, correct for this
    const sortedDomain = range[0] < range[1] ? domain : domain.reverse();
    const domainValue = sortedDomain[domainIndex - 1];
    const index = data.findIndex(d => String(accessor(d)) === String(domainValue));
    nearestDatum = data[index];
    nearestDatumIndex = index;
  } else {
    return null;
  }

  if (nearestDatum == null || nearestDatumIndex == null) return null;

  const distance = Math.abs(Number(coercedScale(accessor(nearestDatum))) - svgCoord);

  return { datum: nearestDatum, index: nearestDatumIndex, distance };
}
