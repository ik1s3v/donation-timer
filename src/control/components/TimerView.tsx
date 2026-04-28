import { Typography } from '@mui/material';
import {
  useWidgetMutation,
  useWidgetQuery,
  useWidgetSubscription,
} from '@widy/react';
import type { IClientMessage } from '@widy/sdk';
import { useEffect, useState } from 'react';
import { TEXT_SHADOW } from '../../constants';
import type { ITimer } from '../../types';
import computePXSize from '../../utils/computePXSize';
import formatTime from '../../utils/formatTime';

const TimerView = ({
  width,
  height,
  backgroundColor,
  timer,
  isControl = false,
}: {
  width: number;
  height: number;
  backgroundColor?: string;
  timer: ITimer;
  isControl?: boolean;
}) => {
  const { data: viewStorage } = useWidgetQuery<unknown, string>({
    scope: 'widgets:view:storage.read',
  });

  const { trigger } = useWidgetMutation<number, unknown>({
    scope: 'widgets:view:storage.write',
  });

  const [time, setTime] = useState(timer.start_time * 60 * 1000);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime((prev) => {
        if (prev <= 0) {
          return 0;
        }
        return prev - 1000;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (viewStorage) {
      setTime(Number(viewStorage));
    }
  }, [viewStorage]);

  useEffect(() => {
    if (isControl) {
      setTime(timer.start_time * 60 * 1000);
    }
  }, [timer.start_time, isControl]);

  useEffect(() => {
    if (!isControl) {
      trigger(time);
    }
  }, [trigger, time, isControl]);

  useWidgetSubscription<string>(
    'widgets:control:storage.subscription',
    async (data) => {
      const newTimer = JSON.parse(data) as ITimer;
      if (
        !viewStorage ||
        time === 0 ||
        newTimer.start_time !== timer.start_time
      ) {
        const newStartTime = newTimer.start_time * 60 * 1000;
        setTime(newStartTime);
      }
    },
  );

  useWidgetSubscription<IClientMessage>(
    'widgets:messages.subscription',
    (data) => {
      const donation = data.donation;
      if (donation && time > 0) {
        setTime(
          (prev) =>
            prev + (donation.exchanged_amount / timer.time_coast) * 60 * 1000,
        );
      }
    },
  );

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height,
        width,
        backgroundColor,
        placeItems: 'center',
        textAlign: 'center',
      }}
    >
      <Typography
        sx={{
          color: timer.timer_color,
          fontSize: computePXSize({
            percent: timer.timer_size,
            width,
            coefficient: 24,
          }),
          textShadow: TEXT_SHADOW,
        }}
      >
        {formatTime(time)}
      </Typography>
      <Typography
        sx={{
          fontSize: computePXSize({
            percent: timer.text_size,
            width,
            coefficient: 24,
          }),
          color: timer.text_color,
          textShadow: TEXT_SHADOW,
        }}
      >
        {timer.text}
      </Typography>
    </div>
  );
};
export default TimerView;
