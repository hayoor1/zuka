import { Button, Card } from '@gemcart/ui';

export default function CheckoutPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <Card className="p-4">
        <h2 className="text-lg font-medium">Checkout</h2>
        <form action="/api/checkout" method="post" className="mt-4 grid grid-cols-1 gap-3">
          <input className="rounded-md border border-zinc-800 bg-black p-2" name="fullName" placeholder="Full name" required />
          <input className="rounded-md border border-zinc-800 bg-black p-2" name="email" placeholder="Email" type="email" required />
          <input className="rounded-md border border-zinc-800 bg-black p-2" name="address1" placeholder="Address line 1" required />
          <input className="rounded-md border border-zinc-800 bg-black p-2" name="city" placeholder="City" required />
          <input className="rounded-md border border-zinc-800 bg-black p-2" name="state" placeholder="State" required />
          <input className="rounded-md border border-zinc-800 bg-black p-2" name="phone" placeholder="Phone" required />
          <Button type="submit">Pay with Paystack</Button>
        </form>
      </Card>
    </div>
  );
}










