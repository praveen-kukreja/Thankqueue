// export const query = jest.fn().mockImplementation((sql, params) => {
//     // Mock implementation of the query function
//     if (sql.includes('SELECT')) {
//       return Promise.resolve({
//         rows: [
//           { id: 1, helperName: 'John Doe', description: 'Helped with project' },
//           { id: 2, helperName: 'Jane Smith', description: 'Assisted in research' },
//         ],
//       });
//     }
//     return Promise.resolve({ rows: [] });
//   });