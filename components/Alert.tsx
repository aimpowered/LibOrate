//Alert message component (used in Login page errors)
import React from "react";

interface Props {
  value: string;
}

export default function Alert({ value }: Props) {
  return (
    <div className="px-5 py-2 text-white bg-red-500 rounded-md">{value}</div>
  );
}
