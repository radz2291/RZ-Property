import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function FAQ() {
  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-bold tracking-tight md:text-3xl">Frequently Asked Questions</h2>

      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger>How do I schedule a property viewing?</AccordionTrigger>
          <AccordionContent>
            You can schedule a viewing by contacting RZ Amin directly through the contact form on any property listing,
            or by calling the provided phone number. Alternatively, you can send a message via WhatsApp for a quick
            response.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-2">
          <AccordionTrigger>What areas in Tawau do you cover?</AccordionTrigger>
          <AccordionContent>
            We cover all residential and commercial areas in Tawau, including Taman Megah, Fajar, Taman Sri, Bukit, and
            surrounding districts. Our extensive local knowledge ensures we can help you find properties in your
            preferred location.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-3">
          <AccordionTrigger>How quickly can I move into a rental property?</AccordionTrigger>
          <AccordionContent>
            The timeline depends on the property's current status and the completion of necessary paperwork. Typically,
            you can move in within 2-4 weeks after signing the rental agreement and paying the required deposits. For
            properties marked as "Ready to Move In," the process can be expedited.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-4">
          <AccordionTrigger>What documents do I need when buying a property?</AccordionTrigger>
          <AccordionContent>
            When purchasing a property, you'll need identification documents (IC/passport), proof of income (salary
            slips or tax returns), bank statements, and sometimes a letter of employment. For financing, additional
            documents may be required by your bank or financial institution. We can guide you through the entire
            documentation process.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-5">
          <AccordionTrigger>Do you help with property financing?</AccordionTrigger>
          <AccordionContent>
            While we don't provide financing directly, we can connect you with trusted financial advisors and banks that
            offer competitive mortgage rates. We can also help you understand the financing options available for
            different property types and guide you through the loan application process.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </section>
  )
}
