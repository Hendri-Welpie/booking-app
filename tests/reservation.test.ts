import { describe, it, expect } from 'vitest';
import * as yup from 'yup';

const schema = yup.object({
  firstname: yup.string().required(),
  surname: yup.string().required(),
  checkinDate: yup.date().required(),
  checkoutDate: yup.date().required().min(yup.ref('checkinDate')),
});

describe('Reservation validation', () => {
  it('fails when checkout is before checkin', async () => {
    const data = { firstname: 'A', surname: 'B', checkinDate: '2025-10-16', checkoutDate: '2025-10-15' };
    await expect(schema.validate(data)).rejects.toBeDefined();
  });

  it('passes valid dates', async () => {
    const data = { firstname: 'A', surname: 'B', checkinDate: '2025-10-15', checkoutDate: '2025-10-16' };
    await expect(schema.validate(data)).resolves.toBeDefined();
  });
});
