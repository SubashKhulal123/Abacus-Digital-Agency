// import { motion } from 'framer-motion';

// /**
//  * Splits text into words and reveals them with a staggered upward
//  * fade — the classic Awwwards-style headline entrance. Use sparingly
//  * (hero + a few section headings), not on every paragraph.
//  */
// export default function RevealText({ text, className, as: Tag = 'span', delay = 0 }) {
//   const words = text.split(' ');

//   return (
//     <Tag className={className}>
//       <span className="sr-only">{text}</span>
//       <span aria-hidden="true" className="inline">
//         {words.map((word, i) => (
//           <span key={i} className="inline-block overflow-hidden">
//             <motion.span
//               className="inline-block"
//               initial={{ y: '110%' }}
//               whileInView={{ y: '0%' }}
//               viewport={{ once: true, margin: '-60px' }}
//               transition={{
//                 duration: 0.8,
//                 delay: delay + i * 0.045,
//                 ease: [0.16, 1, 0.3, 1],
//               }}
//             >
//               {word}&nbsp;
//             </motion.span>
//           </span>
//         ))}
//       </span>
//     </Tag>
//   );
// }

import { motion } from 'framer-motion';

/**
 * Splits text into words and reveals them with a staggered upward fade.
 */
export default function RevealText({
  text,
  className = '',
  as: Tag = 'span',
  delay = 0,
}) {
  const words = text.split(' ');

  return (
    <Tag className={`inline-block ${className}`}>
      {words.map((word, i) => (
        <span
          key={`${word}-${i}`}
          className="inline-block overflow-hidden align-bottom"
        >
          <motion.span
            className="inline-block"
            initial={{
              y: '110%',
              opacity: 0,
            }}
            animate={{
              y: '0%',
              opacity: 1,
            }}
            transition={{
              duration: 0.8,
              delay: delay + i * 0.045,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            {word}
          </motion.span>

          {i < words.length - 1 && '\u00A0'}
        </span>
      ))}
    </Tag>
  );
}
