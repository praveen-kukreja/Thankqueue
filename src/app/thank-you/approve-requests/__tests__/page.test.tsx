// import { render, screen, fireEvent } from '@testing-library/react';
// import '@testing-library/jest-dom';
// import ApproveRequests from '../page';
// import { useSession } from 'next-auth/react';

// // Mock the useSession hook
// jest.mock('next-auth/react', () => ({
//   useSession: jest.fn(),
// }));

// // Mock the fetch API
// global.fetch = jest.fn(() =>
//   Promise.resolve({
//     json: () => Promise.resolve({ requests: [] }),
//   })
// ) as jest.Mock;

// describe('ApproveRequests Component', () => {
//   beforeEach(() => {
//     (useSession as jest.Mock).mockReturnValue({
//       data: { user: { name: 'Test User' } },
//     });
//   });

//   it('renders without crashing', () => {
//     render(<ApproveRequests />);
//     expect(screen.getByText('No Pending Thank Requests')).toBeInTheDocument();
//   });

//   it('displays requests', async () => {
//     (global.fetch as jest.Mock).mockImplementationOnce(() =>
//       Promise.resolve({
//         json: () =>
//           Promise.resolve({
//             requests: [
//               { id: 1, helperName: 'John Doe', description: 'Helped with project' },
//               { id: 2, helperName: 'Jane Smith', description: 'Assisted in research' },
//             ],
//           }),
//       })
//     );

//     render(<ApproveRequests />);
//     expect(await screen.findByText('John Doe')).toBeInTheDocument();
//     expect(await screen.findByText('Jane Smith')).toBeInTheDocument();
//   });

//   it('handles approve button click', async () => {
//     render(<ApproveRequests />);
//     const approveButton = await screen.findByText('Approve');
//     fireEvent.click(approveButton);
//     // Add assertions to verify the approve logic
//   });

//   it('handles send for review button click', async () => {
//     render(<ApproveRequests />);
//     const reviewButton = await screen.findByText('Send for Review');
//     fireEvent.click(reviewButton);
//     // Add assertions to verify the review logic
//   });
// });