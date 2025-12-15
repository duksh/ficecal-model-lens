import data from "../public/data.json";
import type { DataFormat } from "./dataFormat";

const fmt: DataFormat = data as unknown as DataFormat;

export default fmt;
