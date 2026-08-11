import { getAllBookings } from './src/controllers/adminController';

const req = {} as any;
const res = {
  status: function(s: number) { this.statusCode = s; return this; },
  json: function(data: any) { console.log('STATUS:', this.statusCode, '\nDATA:', JSON.stringify(data, null, 2)); }
} as any;

getAllBookings(req, res).catch(console.error);
