import { useWidgetQuery, useWidgetSubscription } from '@widy/react';
import { useEffect, useState } from 'react';
import { DEFAULT_TIMER } from '../constants';
import TimerView from '../control/components/TimerView';
import type { ITimer } from '../types';

const App = () => {
  const { data } = useWidgetQuery<unknown, string>({
    scope: 'widgets:control:storage.read',
  });
  const [timer, setTimer] = useState<ITimer>(DEFAULT_TIMER);

  useEffect(() => {
    if (data) {
      setTimer(JSON.parse(data) as ITimer);
    }
  }, [data]);

  useWidgetSubscription<string>(
    'widgets:control:storage.subscription',
    (data) => {
      setTimer(JSON.parse(data) as ITimer);
    },
  );

  return (
    <TimerView
      width={window.innerWidth}
      height={window.innerHeight}
      timer={timer}
    />
  );
};

export default App;
