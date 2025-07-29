function renderRow(label, value) {
  return (
    <tr key={label} className="border border-solid border-[#eee]">
      <td className="py-3 px-4 font-medium bg-[#f9f9f9] w-[200px] dark:!bg-gray-900 dark:text-gray-300">{label}</td>
      <td className="py-3 px-4 dark:text-gray-300">{value}</td>
    </tr>
  )
}
export default renderRow
